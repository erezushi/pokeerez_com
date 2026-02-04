import axios from 'axios';
import type { EvolutionChain, Pokemon, PokemonSpecies } from 'pokedex-promise-v2';
import { capitalize, isArray, startCase } from 'lodash';
import { chainFormatter, pokedexGames, vowels } from './_utils';
import { NextRequest } from 'next/server';

const pokedex = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
});

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
      const pokemonRequestStartTime = Date.now();
      const apiPokemon = await pokedex.get<Pokemon>(
        `/pokemon/${usedPokemon.toLowerCase()}${usedForm ? `-${usedForm}` : ''}`,
      );

      const pokemonSpeciesRequestStartTime = Date.now();
      const apiPokemonSpecies = await pokedex.get<PokemonSpecies>(
        `/pokemon-species/${usedPokemon.toLowerCase()}`,
      );

      const {
        evolution_chain: evolutionChain,
        pokedex_numbers: pokedexNumbers,
        name: pokemonName,
      } = apiPokemonSpecies.data;

      const EvolutionRequestStartTime = Date.now();
      const evolutionLine = (await axios.get<EvolutionChain>(evolutionChain.url)).data;

      const { types, abilities } = apiPokemon.data;
      const { chain: chainObject } = evolutionLine;

      const id = pokedexNumbers.find(
        (numberObject) => numberObject.pokedex.name === 'national',
      )?.entry_number;

      const typeString = types.map((typeObject) => capitalize(typeObject.type.name)).join(' / ');

      const regularAbilities = abilities.filter((abilityObject) => !abilityObject.is_hidden);
      const hiddenAbility = abilities.find((abilityObject) => abilityObject.is_hidden);

      const isHiddenDuplicate =
        hiddenAbility &&
        regularAbilities.some(
          (regularAbility) => regularAbility.ability.name === hiddenAbility.ability.name,
        );

      if (!info || info === 'generic' || info === 'null') {
        return new Response(
          `${capitalize(pokemonName)}${usedForm ? `-${usedForm}` : ''} is a${
            vowels.test(typeString) ? 'n' : ''
          } ${typeString} type Pokémon with the National Pokédex number of ${id}. It has the abilit${
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
        return new Response(
          `${capitalize(pokemonName)}'s evolution line includes ${chainFormatter(chainObject)}`,
        );
      } else if (info === 'numbers') {
        return new Response(
          `${capitalize(pokemonName)} is ${pokedexNumbers
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
    } catch (error: any) {
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
