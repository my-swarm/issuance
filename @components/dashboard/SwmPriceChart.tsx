import React, { ReactElement } from 'react';
import { Area, AreaChart, Bar, ResponsiveContainer, XAxis } from 'recharts';
import { PriceData } from '@lib';
import { Col, Row, Statistic } from 'antd';
import { colors } from '@app';

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
          <Statistic title="Current" value={lastPrice} precision={4} valueStyle={{ color: colors.blue }} />
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
      <ResponsiveContainer width="99%" minWidth={200} height={120}>
        <AreaChart width={400} height={120} data={data}>
          <XAxis dataKey="date" />
          <Area dataKey="price" fill={colors.blue} stroke={colors.blue} />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}
