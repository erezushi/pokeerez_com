declare namespace Twitch {
  class Embed {
    constructor(
      elementId: string,
      options: {
        allowfullscreen?: boolean;
        autoplay?: boolean;
        channel?: string;
        collection?: string;
        height?: number | string;
        layout?: 'video' | 'video-with-chat';
        muted?: boolean;
        parent?: string[];
        theme?: 'light' | 'dark';
        time?: string;
        video?: string;
        width?: number | string;
      },
    );
  }
}
