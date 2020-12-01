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
      <Space size="large">
        <Statistic title="days" value={Math.floor(duration.asDays())} className="c-countdown-days" />
        <Statistic title="hours" value={duration.hours()} className="c-countdown-hours" />
        <Statistic title="minutes" value={duration.minutes()} className="c-countdown-minutes" />
        <Statistic title="seconds" value={duration.seconds()} className="c-countdown-seconds" />
      </Space>
    </div>
  );
}
