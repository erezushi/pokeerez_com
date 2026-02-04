import _ from 'lodash';
import axios from 'axios';
import randomPokemon, { getGenerations, getPokemon, getTypes } from '@erezushi/pokemon-randomizer';
import { neon } from '@neondatabase/serverless';
import { PokemonSpecies } from 'pokedex-promise-v2';
import { romanize } from 'romans';
import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';

type Choice = {
  key: string;
  pokemonName: string;
  guesses: string[];
};
type Score = {
  'key-id': string;
  key: string;
  id: string;
  score: number;
};
type Manager = {
  key: string;
  manager: string;
};

const { DATABASE_URL, KV_REST_API_TOKEN, KV_REST_API_URL } = process.env;

const sql = neon(DATABASE_URL!);

const redis = new Redis({
  url: KV_REST_API_URL,
  token: KV_REST_API_TOKEN,
});

const answerReplacements = new Map<string | RegExp, string>([
  [/[:.']/g, ''],
  ['é', 'e'],
  ['♀', '-f'],
  ['♂', '-m'],
]);

const answerFormat = (name: string) => {
  let nameCopy = name.toLowerCase().replace(' ', '-');

  answerReplacements.forEach((value, key) => {
    nameCopy.replace(key, value);
  });

  return nameCopy;
};

export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;

  const action = searchParams.get('action');
  const user = searchParams.get('user');
  const key = searchParams.get('key');

  if (!key || key === 'null' || _.isArray(key)) {
    if (action === 'key') {
      const existingManager = (
        await sql`SELECT * FROM "Managers" WHERE manager='${user}'`
      )[0] as Manager;

      if (existingManager) {
        return new Response('Username already registered');
      }

      const { nanoid } = await import('nanoid');

      const newKey = nanoid();

      await sql`INSERT INTO "Managers" ("key", "manager")
        VALUES ('${newKey}', '${user}')`;

      return new Response(
        `${user} registered as a game manager. Game key is ${newKey}\nKeep it somewhere safe, it will not be shown to you again.`,
      );
    } else {
      return new Response(
        'Missing game key. Need to make one? head over to https://github.com/erezushi/pokeerez_com/tree/master/api/game and follow the instructions',
      );
    }
  }

  const managerRecord = (await sql`SELECT * FROM "Managers" WHERE key = ${key}`)[0] as Manager;

  if (!managerRecord) {
    return new Response(
      'Game key not recognized. Need to make one? head over to https://github.com/erezushi/pokeerez_com/tree/master/api/game and follow the instructions',
    );
  }

  const choice = (await sql`SELECT * FROM "Choice" WHERE key = ${key}`)[0] as Choice;

  if (!action || action === 'null' || _.isArray(action)) {
    if (choice) {
      return new Response("Game is running, try '!guesswho guess [Pokémon]'");
    } else {
      return new Response("No game is running, try '!guesswho start [Gen/type]'");
    }
  }

  if (!user || user === 'null' || _.isArray(user)) {
    return new Response('Missing user parameter');
  }

  switch (action) {
    case 'start':
      if (choice) {
        return new Response("Game is already running, try '!guesswho guess [Pokémon]'");
      }

      const filter = searchParams.get('payload');
      if (!filter || filter === 'null' || _.isArray(filter)) {
        return new Response('Please choose either a generation or a type of Pokémon to play.');
      }

      const generations = getGenerations();

      if (_.isFinite(Number(filter))) {
        if (!Object.keys(generations).includes(filter)) {
          return new Response("Number given isn't an existing generation");
        }

        const pokemon = randomPokemon({ generations: [filter], amount: 1 })[0];

        await sql`INSERT INTO "Choice" ("key", "pokemonName", "guesses")
          VALUES (${key}, ${pokemon.name}, ARRAY[]::text[])`;

        await redis.set(key, {
          action,
          payload: {
            chosen: filter,
            generated: _.startCase(pokemon.type),
          },
          user,
        });

        return new Response(
          `Pokémon chosen, Typing: ${_.startCase(pokemon.type)
            .split(' ')
            .join('/')}. use '!guesswho guess [Pokémon]' to place your guesses!`,
        );
      }

      const types = getTypes();

      if (Object.keys(types).includes(filter.toLowerCase())) {
        const pokemon = randomPokemon({ type: filter, amount: 1 })[0];

        await sql`INSERT INTO "Choice" ("key", "pokemonName", "guesses")
          VALUES (${key}, ${pokemon.name}, ARRAY[]::text[])`;

        const generatedGen = Object.entries(generations).find(
          ([_, genObject]) => pokemon.dexNo >= genObject.first && pokemon.dexNo <= genObject.last,
        )![0];

        await redis.set(key, {
          action,
          payload: {
            chosen: filter,
            generated: generatedGen,
          },
          user,
        });

        return new Response(
          `Pokémon chosen, Gen ${romanize(
            Number(generatedGen),
          )}. use '!guesswho guess [Pokémon]' to place your guesses!`,
        );
      }

      return new Response('Filter not a type or a generation number');

    case 'guess':
      if (!choice) {
        return new Response("Game is not running, try '!guesswho start [Gen/type]'");
      }
      const guess = searchParams.get('payload');

      if (!guess || guess === 'null' || _.isArray(guess)) {
        return new Response("You're guessing nothing? A bit pointless, no?");
      }

      const formattedGuess = answerFormat(guess);

      if (formattedGuess === answerFormat(choice.pokemonName)) {
        const scoreRow = (
          await sql`SELECT * FROM "Scores" WHERE id = ${user} AND key = ${key}`
        )[0] as Score;

        const newScore = (scoreRow?.score ?? 0) + 1;

        const keyId = `${key}-${user}`;

        await sql`INSERT INTO "Scores" ("key-id", key, id, score)
          VALUES (${keyId}, ${key}, ${user}, ${newScore})
          ON CONFLICT ("key-id")
          DO UPDATE SET score = ${newScore}`;

        await sql`DELETE FROM "Choice" WHERE key = ${key}`;

        await redis.set(key, {
          action,
          payload: {
            guess,
            success: true,
          },
          user,
        });

        return new Response(
          `That's right! The Pokémon was ${
            choice.pokemonName
          }! ${user} has guessed correctly ${newScore} time${
            newScore === 1 ? '' : 's'
          }.\nCheck the leaderboard using '!guesswho leaderboard'`,
        );
      }

      if (choice.guesses.includes(formattedGuess)) {
        return new Response('Someone already guessed that, try something else');
      }

      const pokemonList = getPokemon();

      if (
        Object.values(pokemonList).some((pokemon) => answerFormat(pokemon.name) === formattedGuess)
      ) {
        await sql`UPDATE "Choice" SET guesses = array_append(guesses, ${formattedGuess}) WHERE key = ${key}`;

        await redis.set(key, {
          action,
          payload: {
            guess,
            success: false,
          },
          user,
        });

        let response = `Nope, it's not ${_.startCase(guess)}, continue guessing!`;

        if (choice.guesses.length % 5 === 4) {
          response += "\nStuck? use '!guesswho hint' to get a random Pokédex entry!";
        }

        return new Response(response);
      }

      return new Response("Hmm.. I don't seem to recognize this Pokémon");

    case 'hint':
      if (!choice) {
        return new Response("Game is not running, try '!guesswho start [Gen/type]'");
      }

      const species = (
        await axios.get<PokemonSpecies>(
          `https://pokeapi.co/api/v2/pokemon-species/${answerFormat(choice.pokemonName)}`,
        )
      ).data;

      const englishDexEntries = species.flavor_text_entries.filter(
        (entry) => entry.language.name === 'en',
      );
      const randomEntry =
        englishDexEntries[Math.floor(Math.random() * englishDexEntries.length)].flavor_text;

      return new Response(
        randomEntry
          .replace(new RegExp(choice.pokemonName, 'gi'), '[Pokémon]')
          .replaceAll('\n', ' ')
          .substring(0, 400),
      );

    case 'leaderboard':
      const topScores =
        (await sql`SELECT * FROM "Scores" WHERE key = ${key} ORDER BY score DESC LIMIT 5`) as Score[];

      return new Response(
        `Top guessers: \n${topScores
          .map(
            (scoreObj, index) =>
              `#${index + 1} ${scoreObj.id} - ${scoreObj.score} guess${
                scoreObj.score !== 1 ? 'es' : ''
              }`,
          )
          .join('; \n')}`,
      );

    case 'reset':
      if (user !== managerRecord.manager) {
        return new Response('Only the game manager can reset the game');
      }

      await sql`DELETE FROM "Choice" WHERE key = ${key}`;
      let responseText = `Reset ${user}'s game`;

      const deleteUserScore = searchParams.get('payload');

      if (deleteUserScore === 'true') {
        await sql`DELETE FROM "Scores" WHERE id = ${user} AND key = ${key}`;
        responseText += ` and deleted their score from it`;
      }

      await redis.set(key, {
        action,
        payload: {
          deleteUserScore,
        },
        user,
      });

      return new Response(responseText);

    default:
      return new Response('Action not recognized');
  }
};
