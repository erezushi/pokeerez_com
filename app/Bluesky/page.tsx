import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Bluesky' };

const page = () => {
  return (
    <div>
      Bluesky was the one Twitter alternative that just felt right, so it&apos;s also a place for me
      to post my channel updates, such as videos posted, streams about to start, or stream schedule
      changes, and also general life updates and ramblings.
      <br />
      Explore some of my posts here:
      <br />
      <iframe
        className="bsky-iframe"
        src="https://widgets.commoninja.com/iframe/b197ca0a-5c47-43ea-a701-709f8c480dda"
      ></iframe>
    </div>
  );
};

export default page;
