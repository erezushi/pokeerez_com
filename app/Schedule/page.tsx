import ScheduleFrame from '@/ui/ScheduleFrame';
import { Metadata } from 'next';
import { Suspense } from 'react';

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
      <Suspense fallback={<></>}>
        <ScheduleFrame />
      </Suspense>
    </div>
  );
};

export default page;
