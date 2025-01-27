import type { Metadata } from 'next';
import VideoEmbed from './VideoEmbed';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'YouTube',
};

const { YOUTUBE_API_KEY } = process.env;

const page = () => {
  return (
    <>
      The PokéErez YouTube channel is my main space for content, whether it be uploaded videos, live
      streams, or shorts with clips from the streams.
      <br />
      <br />
      When it comes to uploads, I make videos about various subjects related to Pokémon, showcases
      of the shiny Pokémon I caught in the main series, and an annual special video every Pokémon
      Day.
      <br />
      My latest uploaded video:
      <br />
      <Suspense>
        <VideoEmbed apiKey={YOUTUBE_API_KEY!} type="video" />
      </Suspense>
      <br />
      <br />
      Every other week, I live-stream three hours of Pokémon shiny hunting, or playthroughs when new
      games come out.
      <br />
      My latest live-stream:
      <br />
      <Suspense>
        <VideoEmbed apiKey={YOUTUBE_API_KEY!} type="live" />
      </Suspense>
      <br />
      <br />
      Whenever I find a shiny during a stream, I clip the encounter, and later upload it as a short.
      <br />
      My latest short:
      <br />
      <Suspense>
        <VideoEmbed apiKey={YOUTUBE_API_KEY!} type="short" />
      </Suspense>
    </>
  );
};

export default page;
