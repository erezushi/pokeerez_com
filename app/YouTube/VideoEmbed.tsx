'use client';

import { Skeleton } from '@mui/material';
import React from 'react';
import useSWR from 'swr';

import './VideoEmbed.css';

interface IVideoEmbedProps {
  apiKey: string;
  type: 'short' | 'video' | 'live';
}

const baseUrl = 'https://youtube.googleapis.com/youtube/v3/search';

const baseParams = {
  channelId: 'UCDaYcp2F0ayJ2wW0UCNLQJw',
  type: 'video',
  part: 'snippet',
  order: 'date',
  maxResults: 1,
};

const typeParams: Record<
  string,
  { videoCaption: 'none' | 'closedCaption'; videoDuration?: 'long' | 'short' }
> = {
  short: {
    videoCaption: 'none',
    videoDuration: 'short',
  },
  video: {
    videoCaption: 'closedCaption',
  },
  live: {
    videoCaption: 'none',
    videoDuration: 'long',
  },
};

const fetcher = (type: IVideoEmbedProps['type'], apiKey: string) =>
  fetch(
    `${baseUrl}?${Object.entries({
      key: apiKey,
      ...baseParams,
      ...typeParams[type],
    })
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`,
  ).then((res) => res.json());

const VideoEmbed = (props: IVideoEmbedProps) => {
  const { apiKey, type } = props;

  const { data, error, isLoading } = useSWR(type, (type: IVideoEmbedProps['type']) =>
    fetcher(type, apiKey),
  );

  if (isLoading)
    return (
      <Skeleton
        variant="rectangular"
        width={type === 'short' ? 270 : 480}
        height={type === 'short' ? 480 : 270}
      />
    );
  if (error) return <div>Failed to load</div>;
  if (data.error)
    return <div className="data-error">{data.error.message.replace(/<.*?>/g, '')}</div>;

  return (
    <iframe
      width={type === 'short' ? 270 : 480}
      height={type === 'short' ? 480 : 270}
      src={`https://www.youtube.com/embed/${data.items[0].id.videoId}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  );
};

export default VideoEmbed;
