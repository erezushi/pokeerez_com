import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shiny Collection',
};

const page = () => {
  return (
    <div>
      Being the neat freak that I am, I&apos;m tracking my shiny collection in a spreadsheet, that I
      made public for view.
      <br />
      Check it out right here:
      <br />
      <iframe
        src="https://docs.google.com/spreadsheets/d/1pOI2mmtyXwApRS7dOhQ5U_xOSp3D6Ax75LjpAUSt-sc/edit?embedded=true&hl=en_US"
        className="collection-iframe"
      />
    </div>
  );
};

export default page;
