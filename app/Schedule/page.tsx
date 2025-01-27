import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Schedule',
};

const page = () => {
  return (
    <div>
      My current stream schedule is every Sunday between 3:30 and 6:30 PM, Israel time, alternating
      between the PokéErez channels and the ErOr Bros. channel.
      <br />
      Check here for an up-to-date, time-zone converted schedule:
      <br />
      <iframe
        className='schedule-iframe'
        src={`https://calendar.google.com/calendar/embed?wkst=1&ctz=${
          Intl.DateTimeFormat().resolvedOptions().timeZone
        }&showPrint=0&mode=WEEK&showCalendars=0&showTitle=0&color=%238E24AA&hl=${
          navigator.language
        }&src=dm1rbGw1bG9uNTJtNzhnbHYycDBwY3Z2MHNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ`}
      ></iframe>
    </div>
  );
};

export default page;
