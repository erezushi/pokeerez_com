import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Twitch' };

const { TWITCH_URL } = process.env;

const page = () => {
  return (
    <div>
      Every other week, I live-stream three hours of Pokémon shiny hunting, or playthroughs when new
      games come out.
      <br />
      Watch my channel & chat here:
      <br />
      <div className="twitch-box">
        <iframe
          className="twitch-iframe"
          src={`https://player.twitch.tv/?channel=pokeerez&parent=${TWITCH_URL}`}
          allowFullScreen
        ></iframe>
        <iframe
          className="twitch-chat-iframe"
          src={`https://www.twitch.tv/embed/pokeerez/chat?parent=${TWITCH_URL}`}
        ></iframe>
      </div>
    </div>
  );
};

export default page;
