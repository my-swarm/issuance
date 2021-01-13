import React, { ReactElement } from 'react';
import { Area, AreaChart, Bar, ResponsiveContainer, XAxis } from 'recharts';
import { PriceData } from '@lib';
import { Col, Row, Statistic } from 'antd';
import { colors } from '@app';

interface SwmPriceChartProps {
  data: PriceData;
}

export function SwmPriceChart({ data }: SwmPriceChartProps): ReactElement {
  const firstPrice = data?.[0].price;
  const lastPrice = data?.[data.length - 1].price;
  const priceDirection: 'up' | 'down' = firstPrice > lastPrice ? 'down' : 'up';
  const changePercent = firstPrice
    ? (priceDirection === 'up' ? 1 - firstPrice / lastPrice : lastPrice / firstPrice - 1) * 100
    : 0;
  console.log({ data, firstPrice, lastPrice, priceDirection, changePercent });

  return (
    <>
      <Row className="mb-3">
        <Col xs={12}>
          <Statistic title="Current" value={lastPrice} precision={4} valueStyle={{ color: colors.blue }} suffix="USD" />
        </Col>
        <Col xs={12}>
          <Statistic
            title="Change"
            value={changePercent}
            precision={2}
            suffix="%"
            valueStyle={{ color: changePercent < 0 ? colors.red : colors.green }}
          />
        </Col>
      </Row>
      <ResponsiveContainer width="99%" minWidth={200} height={160}>
        <AreaChart width={400} height={160} data={data}>
          <XAxis dataKey="date" />
          <Area dataKey="price" fill={colors.blue} stroke={colors.blue} />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}
