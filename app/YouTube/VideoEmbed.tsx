import React from 'react';
import { neon } from '@neondatabase/serverless';

import './VideoEmbed.css';

interface IVideoEmbedProps {
  type: 'short' | 'video' | 'live';
}

const { YOUTUBE_API_KEY, DATABASE_URL } = process.env;

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

const VideoEmbed = async (props: IVideoEmbedProps) => {
  const { type } = props;

  const youtubeRes = await fetch(
    `${baseUrl}?${Object.entries({
      key: YOUTUBE_API_KEY,
      ...baseParams,
      ...typeParams[type],
    })
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`,
  );
  const youtubeData = await youtubeRes.json();

  const sql = neon(DATABASE_URL!);

  let videoId: string;

  if (youtubeData.error) {
    try {
      const idRow = (await sql(`SELECT * FROM "VideoIDs" WHERE type='${type}'`))[0] as {
        type: IVideoEmbedProps['type'];
        id: string;
      };
  
      videoId = idRow.id;
    } catch (error) {
      return <div className="data-error">Failed to retrieve video data</div>
    }
  } else {
    videoId = youtubeData.items[0].id.videoId;

    await sql(`UPDATE "videoIDs" SET id = '${videoId}' WHERE type = '${type}'`);
  }

  return (
    <iframe
      className={`youtube-embed ${type}`}
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  );
};

export default VideoEmbed;
