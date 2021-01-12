import React, { ReactElement, useEffect, useState } from 'react';
import { Datelike, toDayjs } from '@lib';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

interface CountdownProps {
  to: Datelike;
}

export function Countdown({ to }: CountdownProps): ReactElement {
  const [now, setNow] = useState<Dayjs>();

  useEffect(() => {
    handleUpdate();
  }, []);

  const handleUpdate = () => {
    setNow(dayjs());
    window.setTimeout(handleUpdate, 1000);
  };

  const end = toDayjs(to);
  const diff = end.isAfter(now) ? end.diff(now) : 0;
  const duration = dayjs.duration(diff);

  return (
    <div className="c-countdown">
      <div className="item days">
        <strong>{Math.floor(duration.asDays())}</strong>
        <span>days</span>
      </div>
      <div className="item hours">
        <strong>{Math.floor(duration.hours())}</strong>
        <span>hours</span>
      </div>
      <div className="item minutes">
        <strong>{Math.floor(duration.minutes())}</strong>
        <span>min</span>
      </div>
      <div className="item seconds">
        <strong>{Math.floor(duration.seconds())}</strong>
        <span>sec</span>
      </div>
    </div>
  );
}
