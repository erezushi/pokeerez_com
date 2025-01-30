import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const metadata: Metadata = {
  title: 'NameGame',
};

const page = () => {
  return (
    <div>
      <Link href="https://names.pokeerez.com">Check it out here!</Link>
      <br />
      The Name Game is a simple premise: you get a Pokémon name in a non-English language (that
      still uses the latin alphabet), and you need to guess what Pokémon that name belongs to.
      <br />
      <Image
        src="/images/NameGame Default.webp"
        alt="An example screenshot of the Name Game upon first load"
        className="website-image"
        width={400}
        height={225}
      />
      <br />
      As you submit guesses, the game will offer hints to help you along: The name's language after
      1 guess, the Pokémon's generation after 3 guesses, and the Pokémon's typing after 6 guesses.
      <br />
      <Image
        src="/images/NameGame 1 Hint.webp"
        alt="A screenshot of the Name Game offering the first hint"
        className="website-image"
        width={400}
        height={225}
      />
      <Image
        src="/images/NameGame 2 Hints.webp"
        alt="A screenshot of the Name Game offering the second hint"
        className="website-image"
        width={400}
        height={225}
      />
      <br />
      <Image
        src="/images/NameGame 3 Hints.webp"
        alt="A screenshot of the Name Game offering the third hint"
        className="website-image"
        width={400}
        height={225}
      />
      <Image
        src="/images/NameGame Hints Used.webp"
        alt="A screenshot of the Name Game after the player used all hints"
        className="website-image"
        width={400}
        height={225}
      />
      <br />
      After guessing the correct Pokémon, the game will display it big and proud, and let you read
      up on the Pokémon's name origins on its Bulbapedia page.
      <br />
      Hitting 'Play again!' will reset the game and give you a new name to guess.
      <br />
      <Image
        src="/images/NameGame Win.webp"
        alt="A screenshot of the Name Game's win screen"
        className="website-image"
        width={400}
        height={225}
      />
    </div>
  );
};

export default page;
