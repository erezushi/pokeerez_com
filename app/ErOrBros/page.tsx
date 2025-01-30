import Link from 'next/link';
import VideoEmbed from '@/ui/VideoEmbed';
import { Suspense } from 'react';
import { Skeleton } from '@mui/material';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ErOr Bros.',
};

const page = () => {
  return (
    <div>
      Together with my brother, I run another YouTube channel called ErOr Bros., where we upload and
      stream whatever games we want. I stream on this channel on the off-Sundays that I don&apos;t
      stream on PokéErez.
      <br />
      This channel lacks a Twitch counterpart, but does have its own{' '}
      <Link href="https://twitter.com/ErOrBros">Twitter</Link> and{' '}
      <Link href="https://ErOrBros.bsky.social">Bluesky</Link> accounts for channel updates due to
      being a co-owned channel.
      <br />
      Check out our latest video/stream:
      <br />
      <Suspense fallback={<Skeleton variant="rectangular" className="youtube-skeleton video" />}>
        <VideoEmbed type="ErOr" />
      </Suspense>
    </div>
  );
};

export default page;
