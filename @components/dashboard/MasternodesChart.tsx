import React, { ReactElement } from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis } from 'recharts';
import { MasternodesData } from '@lib';
import { Col, Row, Statistic } from 'antd';
import { Loading } from '../utility';
import { colors } from '@app';

interface MasternodesChartProps {
  data: MasternodesData;
  numNodes: number;
  roi: number;
}

export function MasternodesChart({ data, numNodes, roi }: MasternodesChartProps): ReactElement {
  if (!data || data.length === 0 || !numNodes || !roi) return <Loading />;
  return (
    <>
      <Row className="mb-3">
        <Col xs={12}>
          <Statistic title="Active nodes" value={numNodes} valueStyle={{ color: colors.blue }} />
        </Col>
        <Col xs={12}>
          <Statistic title="Annual ROI" value={roi} suffix="%" valueStyle={{ color: colors.green }} />
        </Col>
      </Row>

      <ResponsiveContainer width="99%" minWidth={200} height={160}>
        <AreaChart width={400} height={160} data={data}>
          <XAxis dataKey="date" />
          <Area dataKey="active" stackId="a" fill={colors.blue} stroke={colors.blue} />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}
