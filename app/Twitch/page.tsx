'use client';

import Script from 'next/script';
import { useCallback } from 'react';

const page = () => {
  const onTwitchLoad = useCallback(() => {
    new Twitch.Embed('twitch-box', {
      width: '100%',
      height: '100%',
      channel: 'pokeerez',
      // video: '2790869467',
    });
  }, []);

  return <Script src="https://embed.twitch.tv/embed/v1.js" onLoad={onTwitchLoad} />;
};

export default page;
