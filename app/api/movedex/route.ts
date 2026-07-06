import { capitalize, isArray, startCase } from 'lodash';
import { NextRequest } from 'next/server';
import Pokedex from 'pokedex-promise-v2';

const pokedex = new Pokedex();

const vowels = /^[AEIOUaeiou]/;

export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;

  const move = searchParams.get('move');

  if (move && !isArray(move) && move !== 'null') {
    try {
      const apiMove = await pokedex.getMoveByName(move);
      const {
        name: moveName,
        type,
        damage_class,
        power,
        pp,
        accuracy,
        flavor_text_entries,
      } = apiMove;
      const { name: typeName } = type;
      const { name: categoryName } = damage_class;
      const description = flavor_text_entries
        .filter(
          (entry) =>
            entry.language.name === 'en' &&
            !entry.flavor_text.startsWith('This move can’t be used'),
        )
        .at(-1)
        ?.flavor_text.replace('\n', ' ');

      let res = `${startCase(moveName)} is ${vowels.test(typeName) ? 'an' : 'a'} ${capitalize(typeName)}-type ${capitalize(categoryName)} move with `;

      if (categoryName !== 'status') {
        res += `${power ?? 'varying'} base power, `;
      }

      res += `${pp} PP and ${accuracy ?? 'perfect'} accuracy. "${description}"`;

      return new Response(res);
    } catch (error) {
      return new Response(`Couldn't find move ${move}`);
    }
  } else {
    return new Response('Please enter a move');
  }
};
