import Link from 'next/link';

const Home = () => {
  return (
    <div>
      Hi!
      <br />
      My name is Erez, and I&apos;m a content creator focusing mostly on the Pokémon franchise.
      <br />
      <br />
      You can find my content on <Link href="https://youtube.com/@pokeerez">YouTube</Link> and{' '}
      <Link href="https://twitch.tv/pokeerez">Twitch</Link>, with social media updates on{' '}
      <Link href="https://twitter.com/pokeerezmc">Twitter</Link> and{' '}
      <Link href="https://bsky.app/profile/pokeerez.com">Bluesky</Link>.
      <br />
      <br />
      With my brother, I also run a non-Pokémon focused channel called{' '}
      <Link href="https://youtube.com/@erorbros">ErOr Bros.</Link>, which also has its own{' '}
      <Link href="https://twitter.com/erorbros">Twitter</Link> and{' '}
      <Link href="https://erorbros.bsky.social">Bluesky</Link>.
      <br />
      <br />
      Other than my content creation endeavors, I also dabble in programming.
      <br />
      Not only is this website completely coded by me, but I also have other websites: a{' '}
      <Link href="https://generator.pokeerez.com">random Pokémon generator tool</Link> and what I
      like to call <Link href="https://names.pokeerez.com">The Name Game</Link>.
      <br />
      <br />
      Browse the different pages for further details on each section, or check out my{' '}
      <Link href="https://linktr.ee/erezushi">Linktree</Link> if you only want to find my links.
    </div>
  );
};

export default Home;
