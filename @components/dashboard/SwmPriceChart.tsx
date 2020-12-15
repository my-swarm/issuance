import React, { ReactElement } from 'react';
import { Area, AreaChart, Bar, ResponsiveContainer, XAxis } from 'recharts';
import { PriceData } from '@lib';

interface SwmPriceChartProps {
  data: PriceData;
}

export function SwmPriceChart({ data }: SwmPriceChartProps): ReactElement {
  return (
    <ResponsiveContainer width="99%" minWidth={200} height={120}>
      <AreaChart width={400} height={120} data={data}>
        <XAxis dataKey="date" />
        <Area dataKey="price" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
