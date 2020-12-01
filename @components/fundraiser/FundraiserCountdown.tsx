import React, { ReactElement } from 'react';
import moment from 'moment';
import { Datelike, toMoment } from '@lib';
import { Countdown } from '../utility';

interface FundraiserCountdownProps {
  startDate: Datelike;
  endDate: Datelike;
}

export function FundraiserCountdown({ startDate, endDate }: FundraiserCountdownProps): ReactElement {
  const start = toMoment(startDate);
  const end = toMoment(endDate);
  const now = moment();
  if (start.isAfter(end)) return null;
  return (
    <div>
      {now.isBefore(start) ? (
        <>
          <h3 className="mb-0">Starts in</h3>
          <Countdown to={start} />
        </>
      ) : (
        <>
          <h3 className="mb-0">Ends in</h3>
          <Countdown to={end} />
        </>
      )}
    </div>
  );
}
