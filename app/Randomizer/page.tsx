import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Generator' };

const page = () => {
  return (
    <div>
      <Link href="https://generator.pokeerez.com">Check it out here!</Link>
      <br />
      Other than this site, I developed is my own version of a random Pokémon generator.
      <br />
      Select various filters, or a custom list of Pokémon, and let the site generate a selection of
      species out of it.
      <br />
      <Image
        src="/images/Randomizer Default - Filters.webp"
        alt="A screenshot of the randomizer website on the filter choosing screen"
        className="website-image"
        width={400}
        height={225}
      />
      <Image
        src="/images/Randomizer Default - List.webp"
        alt="A screenshot of the randomizer website on the custom list choosing screen"
        className="website-image"
        width={400}
        height={225}
      />
      <br />
      After getting the Pokémon selection, you can check each specie&apos;s page in popular Pokémon
      info sites, or click the Pokémon to display basic info about it.
      <Image
        src="/images/Randomizer Generated List.webp"
        alt="A screenshot of the randomizer website showing a generated list of random Pokémon"
        className="website-image"
        width={400}
        height={225}
      />
      <Image
        src="/images/Randomizer Details Page.webp"
        alt="A screenshot of the randomizer website displaying a Pokémon's details"
        className="website-image"
        width={400}
        height={225}
      />
      <br />
      Lastly, by hitting &quot;Export to &apos;Showdown!&apos;&quot;, you can select up to six
      Pokémon, customize them, and export them as a team to Pokémon Showdown! or PokéPaste.
      <Image
        src="/images/Randomizer Export - Empty.webp"
        alt="A screenshot of the randomizer website's Showdown! export page as it appears right after clicking the export button"
        className="website-image"
        width={400}
        height={225}
      />
      <Image
        src="/images/Randomizer Export - Full.webp"
        alt="A screenshot of the randomizer website's Showdown! export page after filling up some details"
        className="website-image"
        width={400}
        height={225}
      />
    </div>
  );
};

export default page;
