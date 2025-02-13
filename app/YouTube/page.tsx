import type { Metadata } from 'next';
import VideoEmbed from '@/ui/VideoEmbed';
import { Suspense } from 'react';
import { Skeleton } from '@mui/material';

export const metadata: Metadata = { title: 'YouTube' };

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
      <Suspense fallback={<Skeleton variant="rectangular" className="youtube-skeleton video" />}>
        <VideoEmbed type="video" />
      </Suspense>
      <br />
      <br />
      Every other week, I live-stream three hours of Pokémon shiny hunting, or playthroughs when new
      games come out.
      <br />
      My latest live-stream:
      <br />
      <Suspense fallback={<Skeleton variant="rectangular" className="youtube-skeleton live" />}>
        <VideoEmbed type="live" />
      </Suspense>
      <br />
      <br />
      Whenever I find a shiny during a stream, I clip the encounter, and later upload it as a short.
      <br />
      My latest short:
      <br />
      <Suspense fallback={<Skeleton variant="rectangular" className="youtube-skeleton short" />}>
        <VideoEmbed type="short" />
      </Suspense>
    </>
  );
};

export default page;
