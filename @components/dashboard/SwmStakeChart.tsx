import React, { ReactElement } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Space, Tag } from 'antd';
import { VSpace } from '../utility';

interface SwmStakeChartProps {
  total: number;
  masternodes: number;
  tokens: number;
}

const color1 = '#8884d8';
const color2 = '#82ca9d';
const color3 = '#729afd';

export function SwmStakeChart({ total, masternodes, tokens }: SwmStakeChartProps): ReactElement {
  const circulating = total - masternodes - tokens;
  const data = [{ masternodes, tokens, circulating, name: 'swm' }];
  return (
    <>
      <ResponsiveContainer width="99%" minWidth={100} height={40}>
        <BarChart
          width={400}
          height={40}
          data={data}
          layout="vertical"
          margin={{ top: 0, left: 0, bottom: 0, right: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" hide />
          <Bar dataKey="masternodes" stackId="a" fill={color1} />
          <Bar dataKey="tokens" stackId="a" fill={color2} />
          <Bar dataKey="circulating" stackId="a" fill={color3} />
        </BarChart>
      </ResponsiveContainer>
      <VSpace />
      <div>
        <Tag color={color1}>
          Staked by masternodes: <strong>{masternodes} SWM</strong>
        </Tag>
        <Tag color={color2}>
          Staked with token issuance: <strong>{tokens} SWM</strong>
        </Tag>
        <Tag color={color3}>
          Circulating supply: <strong>{circulating} SWM</strong>
        </Tag>
      </div>
    </>
  );
}
