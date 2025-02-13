'use client';

import React from 'react';

const ScheduleFrame = () => (
  <iframe
    className="schedule-iframe"
    src={`https://calendar.google.com/calendar/embed?wkst=1&ctz=${
      Intl.DateTimeFormat().resolvedOptions().timeZone
    }&showPrint=0&mode=WEEK&showCalendars=0&showTitle=0&color=%238E24AA&hl=${
      navigator.language
    }&src=dm1rbGw1bG9uNTJtNzhnbHYycDBwY3Z2MHNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ`}
  />
);

export default ScheduleFrame;
