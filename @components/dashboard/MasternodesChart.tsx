import React, { ReactElement } from 'react';
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis } from 'recharts';
import { MasternodesData, PriceData } from '@lib';
import { Card, Col, Row, Statistic } from 'antd';
import { Loading } from '../utility';

interface MasternodesChartProps {
  data: MasternodesData;
  numNodes: number;
  roi: number;
}

const color1 = '#46ce6f';
const color2 = '#ffbc36';

export function MasternodesChart({ data, numNodes, roi }: MasternodesChartProps): ReactElement {
  console.log('mn', { data, numNodes, roi });
  if (!data || data.length === 0 || !numNodes || !roi) return <Loading />;
  return (
    <>
      <Row className="mb-3">
        <Col xs={12}>
          <Statistic title="Active nodes" value={numNodes} valueStyle={{ color: 'green' }} />
        </Col>
        <Col xs={12}>
          <Statistic title="Annual ROI" value={roi} suffix="%" valueStyle={{ color: 'red' }} />
        </Col>
      </Row>

      <ResponsiveContainer width="99%" minWidth={200} height={120}>
        <BarChart width={400} height={120} data={data}>
          <XAxis dataKey="date" />
          <Bar dataKey="active" stackId="a" fill={color1} />
          <Bar dataKey="warmup" stackId="a" fill={color2} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
