import React, { ReactElement } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Row, Col, Tag } from 'antd';
import { Loading, VSpace } from '../utility';
import { formatNumber } from '@lib';
import { colors } from '@app';

interface SwmStakeChartProps {
  total: number;
  masternodes: number;
  tokens: number;
}

export function SwmStakeChart({ total, masternodes, tokens }: SwmStakeChartProps): ReactElement {
  if (!total || !masternodes || !tokens) return <Loading />;

  const circulating = total - masternodes - tokens;
  const data = [{ masternodes, tokens, circulating, name: 'swm' }];

  function renderLegend(color: string, title: string, amount: number) {
    return (
      <Row gutter={8} className="mb-1" justify="space-between">
        <Col flex="1rem">
          <div style={{ width: '1rem', height: '100%', background: color }} />
        </Col>
        <Col flex="auto">{title}:</Col>
        <Col flex="auto" style={{ textAlign: 'right' }}>
          {formatNumber(amount)} SWM
        </Col>
      </Row>
    );
  }

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
          <Bar dataKey="masternodes" stackId="a" fill={colors.blue} />
          <Bar dataKey="tokens" stackId="a" fill={colors.orange} />
          <Bar dataKey="circulating" stackId="a" fill={colors.grey1} />
        </BarChart>
      </ResponsiveContainer>
      <VSpace />
      {renderLegend(colors.blue, 'Staked by masternodes', masternodes)}
      {renderLegend(colors.orange, 'Staked with token issuance', tokens)}
      {renderLegend(colors.grey1, 'Circulating supply', circulating)}
    </>
  );
}
