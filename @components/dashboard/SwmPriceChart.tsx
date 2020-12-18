import React, { ReactElement } from 'react';
import { Area, AreaChart, Bar, ResponsiveContainer, XAxis } from 'recharts';
import { PriceData } from '@lib';
import { Card, Col, Row, Statistic } from 'antd';

interface SwmPriceChartProps {
  data: PriceData;
  lastPrice: number;
  changePercent: number;
}

export function SwmPriceChart({ data, lastPrice, changePercent }: SwmPriceChartProps): ReactElement {
  return (
    <>
      <Row className="mb-3">
        <Col xs={12}>
          <Statistic title="Current" value={lastPrice} precision={4} valueStyle={{ color: 'green' }} />
        </Col>
        <Col xs={12}>
          <Statistic title="Change" value={changePercent} precision={2} suffix="%" valueStyle={{ color: 'red' }} />
        </Col>
      </Row>
      <ResponsiveContainer width="99%" minWidth={200} height={120}>
        <AreaChart width={400} height={120} data={data}>
          <XAxis dataKey="date" />
          <Area dataKey="price" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}
