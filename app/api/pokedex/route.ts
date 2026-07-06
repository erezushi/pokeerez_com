import Pokedex from 'pokedex-promise-v2';
import { capitalize, isArray, startCase } from 'lodash';
import { chainFormatter, pokedexGames, vowels } from './_utils';
import { NextRequest } from 'next/server';

const pokedex = new Pokedex();

export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;

  const pokemon = searchParams.get('pokemon');
  const form = searchParams.get('form');
  const info = searchParams.get('info');

  if (pokemon && !isArray(pokemon) && pokemon !== 'null') {
    const usedForm =
      form && !isArray(form) && form !== 'default' && form !== 'null' ? form.toLowerCase() : null;

    const usedPokemon =
      pokemon === 'random' ? (Math.floor(Math.random() * 1025) + 1).toString() : pokemon;

    try {
      const apiPokemon = await pokedex.getPokemonByName(
        `${usedPokemon.toLowerCase()}${usedForm ? `-${usedForm}` : ''}`,
      );
      const apiPokemonSpecies = await pokedex.getPokemonSpeciesByName(usedPokemon.toLowerCase());

      const { id: natDexNo, name } = apiPokemon;

      const pokemonName = name
        .split('-')
        .map((namePart) => capitalize(namePart))
        .join('-');

      if (!info || info === 'generic' || info === 'null') {
        const { types, abilities } = apiPokemon;

        const typeString = types.map((typeObject) => capitalize(typeObject.type.name)).join(' / ');

        const regularAbilities = abilities.filter((abilityObject) => !abilityObject.is_hidden);
        const hiddenAbility = abilities.find((abilityObject) => abilityObject.is_hidden);

        const isHiddenDuplicate =
          hiddenAbility &&
          regularAbilities.some(
            (regularAbility) => regularAbility.ability.name === hiddenAbility.ability.name,
          );
        return new Response(
          `${pokemonName} is a${
            vowels.test(typeString) ? 'n' : ''
          } ${typeString} type Pokémon with the National Pokédex number of ${natDexNo}. It has the abilit${
            regularAbilities.length === 1 ? 'y' : 'ies'
          } ${regularAbilities
            .map((abilityObject) => {
              return startCase(abilityObject.ability.name);
            })
            .join(' and ')}${
            hiddenAbility && !isHiddenDuplicate
              ? ` with the hidden ability ${startCase(hiddenAbility.ability.name)}`
              : ''
          }.`,
        );
      } else if (info === 'evolution') {
        const evolutionLine = await pokedex.getEvolutionChainById(
          Number(apiPokemonSpecies.evolution_chain.url.split('/').at(-2)),
        );

        return new Response(
          `${pokemonName}'s evolution line includes ${chainFormatter(evolutionLine.chain)}`,
        );
      } else if (info === 'numbers') {
        return new Response(
          `${pokemonName} is ${apiPokemonSpecies.pokedex_numbers
            .filter((numberObject) => pokedexGames[numberObject.pokedex.name])
            .map((numberObject) => {
              const { entry_number: number, pokedex } = numberObject;

              return `number ${number} in the ${pokedexGames[pokedex.name]} Pokédex`;
            })
            .join(', ')
            .replace(/,([^,]*)$/, ' and$1')}.`,
        );
      } else {
        return new Response('Info can only be one of: generic, evolution, numbers');
      }
    } catch (error) {
      return new Response(
        `Couldn't find Pokémon ${capitalize(pokemon)}${usedForm ? ` with form ${usedForm}` : ''}`,
      );
    }
  } else {
    return new Response(`Syntax: !pokedex [pokemon] [info] [form].
        pokemon: Pokémon name or natDex number.
        info: generic/evolution/numbers.
        form: Pokémon form, use 'default' for regular/no form.`);
  }
};
