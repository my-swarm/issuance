import React, { ReactElement } from 'react';
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis } from 'recharts';
import { MasternodesData, PriceData } from '@lib';

interface MasternodesChartProps {
  data: MasternodesData;
}

const color1 = '#46ce6f';
const color2 = '#ffbc36';

export function MasternodesChart({ data }: MasternodesChartProps): ReactElement {
  return (
    <ResponsiveContainer width="99%" minWidth={200} height={120}>
      <BarChart width={400} height={120} data={data}>
        <XAxis dataKey="date" />
        <Bar dataKey="active" stackId="a" fill={color1} />
        <Bar dataKey="warmup" stackId="a" fill={color2} />
      </BarChart>
    </ResponsiveContainer>
  );
}
