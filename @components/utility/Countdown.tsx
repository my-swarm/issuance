import React, { ReactElement, useEffect, useState } from 'react';
import { Datelike, toMoment } from '@lib';
import { Space, Statistic } from 'antd';
import moment, { Moment } from 'moment';

interface CountdownProps {
  to: Datelike;
}

export function Countdown({ to }: CountdownProps): ReactElement {
  const [now, setNow] = useState<Moment>();

  useEffect(() => {
    handleUpdate();
  }, []);

  const handleUpdate = () => {
    setNow(moment());
    window.setTimeout(handleUpdate, 1000);
  };

  const end = toMoment(to);
  const diff = end.isAfter(now) ? end.diff(now) : 0;
  const duration = moment.duration(diff);

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
