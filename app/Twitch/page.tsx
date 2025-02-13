import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Twitch' };

const { TWITCH_URL } = process.env;

const page = () => {
  return (
    <div>
      Every other week, I live-stream three hours of Pokémon shiny hunting, or playthroughs when new
      games come out.
      <br />
      Watch my channel here:
      <br />
      <iframe
        className="twitch-iframe"
        src={`https://player.twitch.tv/?channel=pokeerez&parent=${TWITCH_URL}`}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default page;
