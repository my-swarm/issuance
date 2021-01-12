import React, { ReactElement } from 'react';
import dayjs from 'dayjs';
import { Datelike, toDayjs } from '@lib';
import { Countdown } from '../utility';

interface FundraiserCountdownProps {
  startDate: Datelike;
  endDate: Datelike;
}

export function FundraiserCountdown({ startDate, endDate }: FundraiserCountdownProps): ReactElement {
  const start = toDayjs(startDate);
  const end = toDayjs(endDate);
  const now = dayjs();
  if (start.isAfter(end)) return null;
  return (
    <div>
      {now.isBefore(start) ? (
        <>
          <h3>Starts in</h3>
          <Countdown to={start} />
        </>
      ) : (
        <>
          <h3>Ends in</h3>
          <Countdown to={end} />
        </>
      )}
    </div>
  );
}
