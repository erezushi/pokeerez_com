import { getTypes } from '@erezushi/pokemon-randomizer';
import { capitalize, isArray, startCase } from 'lodash';
import { NextRequest } from 'next/server';
import Pokedex from 'pokedex-promise-v2';
import { chainFormatter, effectivenessAbilities, pokedexGames, vowels } from './_utils';

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

      const { name } = apiPokemon;
      const { id: natDexNo } = apiPokemonSpecies;

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
      } else if (info === 'weakness') {
        type PokemonType = keyof typeof typeList;
        const typeList = getTypes();
        const multipliers = Object.fromEntries(
          Object.entries(typeList).map(([typeName]) => [typeName, 1]),
        );

        apiPokemon.types.forEach((typeObj) => {
          const typeName = typeObj.type.name as PokemonType;
          const { vulnerable, resists, immune } = typeList[typeName];

          if (vulnerable !== '') {
            vulnerable.split(' ').forEach((vulType) => {
              multipliers[vulType] *= 2;
            });
          }

          if (resists !== '') {
            resists.split(' ').forEach((resType) => {
              multipliers[resType] /= 2;
            });
          }

          if (immune !== '') {
            immune.split(' ').forEach((immType) => {
              multipliers[immType] = 0;
            });
          }
        });

        const results = {
          weakTo: Object.entries(multipliers)
            .filter(([_, multiplier]) => multiplier > 1)
            .map(([type]) => capitalize(type)),
          resists: Object.entries(multipliers)
            .filter(([_, multiplier]) => multiplier < 1 && multiplier !== 0)
            .map(([type]) => capitalize(type)),
          immuneTo: Object.entries(multipliers)
            .filter(([_, multiplier]) => multiplier === 0)
            .map(([type]) => capitalize(type)),
        };

        let response = `Ignoring special conditions, ${pokemonName} is weak to ${results.weakTo
          .join(', ')
          .replace(/,([^,]*)$/, ' and$1')},`;

        if (results.resists.length)
          response += ` it resists ${results.resists.join(', ').replace(/,([^,]*)$/, ' and$1')},`;

        if (results.immuneTo.length)
          response += ` it's immune to ${results.immuneTo.join(', ').replace(/,([^,]*)$/, ' and$1')},`;

        response = response.replace(/,$/, '.').replace(/, it(?!.*, it)/, ' and it');

        const changingAbilities = effectivenessAbilities.filter((effAbility) =>
          apiPokemon.abilities.some((pokeAbility) => pokeAbility.ability.name === effAbility.name),
        );

        if (changingAbilities.length) {
          changingAbilities.forEach((ability) => {
            response += ` When it has the ${startCase(ability.name)} ability, it becomes `;

            if (ability.immune) {
              if (multipliers[ability.immune] === 0) {
                response = response.replace(
                  /When it has.*/,
                  `Although it has the ${startCase(ability.name)} ability, it's already immune to ${capitalize(ability.immune)}`,
                );
              } else {
                response += `immune to ${capitalize(ability.immune)}.`;
              }
            } else if (ability.resist) {
              response +=
                ability.resist
                  .split(' ')
                  .map((resistType) => {
                    let retString = '';

                    switch (multipliers[resistType as PokemonType]) {
                      case 0.25:
                        retString += 'even more resistant ';
                        break;
                      case 0.5:
                        retString += 'more resistant ';
                        break;
                      case 1:
                        retString += 'resistant ';
                        break;
                      case 2:
                        retString += 'not weak ';
                        break;
                      case 4:
                        retString += 'not as weak ';
                        break;
                      default:
                        break;
                    }

                    retString += `to ${capitalize(resistType)}`;

                    return retString;
                  })
                  .join(' and ') + '.';
            } else if (ability.weak) {
              switch (multipliers[ability.weak]) {
                case 0.25:
                  response += 'less resistant ';
                  break;
                case 0.5:
                  response += 'not resistant ';
                  break;
                case 1:
                  response += 'weak ';
                  break;
                case 2:
                  response += 'weaker ';
                  break;
                case 4:
                  response += 'even weaker ';
                  break;
                default:
                  break;
              }

              response += `to ${capitalize(ability.weak)}`;
            }
          });
        }

        return new Response(response);
      } else if (info === 'stats') {
        const STAT_NAMES = ['HP', 'Attack', 'Defense', 'Sp. Attack', 'Sp. Defense', 'Speed'];
        const { stats } = apiPokemon;
        const bst = stats.reduce((currentTotal, statObj) => currentTotal + statObj.base_stat, 0);

        return new Response(
          `${pokemonName}'s base stats are ${stats
            .map((statObj, index) => `${statObj.base_stat} ${STAT_NAMES[index]}`)
            .join(', ')
            .replace(/,([^,]*)$/, ' and$1')}. That's a total of ${bst}.`,
        );
      } else {
        return new Response(
          'Info can only be one of: generic, evolution, numbers, weakness, stats',
        );
      }
    } catch (error) {
      return new Response(
        `Couldn't find Pokémon ${capitalize(pokemon)}${usedForm ? ` with form ${usedForm}` : ''}`,
      );
    }
  } else {
    return new Response(`Syntax: !pokedex [pokemon] [info] [form].
        pokemon: Pokémon name or natDex number.
        info: generic/evolution/numbers/weakness/stats.
        form: Pokémon form, use 'default' for regular/no form.`);
  }
};
