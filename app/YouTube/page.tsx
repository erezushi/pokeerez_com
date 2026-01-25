import type { Metadata } from 'next';
import VideoEmbed from '@/ui/VideoEmbed';

export const metadata: Metadata = { title: 'YouTube' };

export const revalidate = 3600;

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
      My latest uploaded video*:
      <br />
      <VideoEmbed type="video" />
      <br />
      <br />
      Every other week, I live-stream three hours of Pokémon shiny hunting, or playthroughs when new
      games come out.
      <br />
      My latest live-stream*:
      <br />
      <VideoEmbed type="live" />
      <br />
      <br />
      Whenever I find a shiny during a stream, I clip the encounter, and later upload it as a short.
      <br />
      My latest short*:
      <br />
      <VideoEmbed type="short" />
      <br />
      <br />
      <span className="footnote">*may take up to an hour to update</span>
    </>
  );
};

export default page;
