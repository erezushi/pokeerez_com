import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Twitter',
};

const page = () => {
  return (
    <div>
      Twitter is where I post channel updates such as videos posted, streams about to start, or
      stream schedule changes, and also general life updates and ramblings.
      <br />
      Explore some of my posts here:
      <br />
      <iframe
        className="twitter-iframe"
        src="https://widgets.sociablekit.com/twitter-feed/iframe/25515331"
      ></iframe>
    </div>
  );
};

export default page;
