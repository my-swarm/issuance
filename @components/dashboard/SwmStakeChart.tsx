import React, { ReactElement } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Row, Col, Tag, Tooltip } from 'antd';
import { Loading, VSpace } from '../utility';
import { formatNumber } from '@lib';
import { colors, knownAccounts, useSwmBalance } from '@app';

interface SwmStakeChartProps {
  total: number;
  mnStake: number;
  issuerStake: number;
}

interface Metric {
  label: string;
  amount: number;
  color: string;
}

type Metrics = Record<string, Metric>;

export function SwmStakeChart({ total, mnStake, issuerStake }: SwmStakeChartProps): ReactElement {
  const [treasuryBalance] = useSwmBalance(knownAccounts.swarmTreasury);
  const [mnRewardsBalance] = useSwmBalance(knownAccounts.swarmMnRewards);
  if (!total || !mnStake || !issuerStake) return <Loading />;

  const circulating = total - mnStake - issuerStake;
  const metrics: Metrics = {
    treasuryBalance: {
      label: 'Swarm Network Treasury',
      amount: treasuryBalance.number,
      color: colors.orange,
    },
    mnRewardsBalance: {
      label: 'Swarm MN Rewards',
      amount: mnRewardsBalance.number,
      color: colors.yellow,
    },
    mnStake: {
      label: 'Staked by Masternodes',
      amount: mnStake,
      color: colors.blue,
    },
    issuerStake: {
      label: 'Staked by Issuers',
      amount: issuerStake,
      color: colors.green,
    },
    circulating: {
      label: 'Circulating',
      amount: circulating,
      color: colors.grey1,
    },
  };
  const sum = Object.values(metrics)
    .map((metric) => metric.amount)
    .reduce((a, b) => a + b, 0);

  function renderLegend(key: string) {
    const metric = metrics[key];
    const percent = Math.round((metric.amount / sum) * 100 * 100) / 100;
    return (
      <Row gutter={8} className="mb-1" justify="space-between">
        <Col flex="1rem">
          <div style={{ width: '1rem', height: '100%', background: metric.color }} />
        </Col>
        <Col flex="auto">{metric.label}:</Col>
        <Col flex="auto" style={{ textAlign: 'right' }}>
          {percent} %<br />
          <span className="xs">{formatNumber(metric.amount)} SWM</span>
        </Col>
      </Row>
    );
  }

  function renderBar(key: string) {
    const metric = metrics[key];
    const percent = Math.round((metric.amount / sum) * 100 * 100) / 100;
    const width = Math.max(1, percent);
    return (
      <Tooltip title={`${metric.label}: ${percent} %`}>
        <div style={{ width: `${width}%`, backgroundColor: metric.color }} />
      </Tooltip>
    );
  }

  return (
    <div className="c-swm-stake-chart">
      <div className="chart">{Object.keys(metrics).map((key) => renderBar(key))}</div>
      <VSpace />
      <div className="table">{Object.keys(metrics).map((key) => renderLegend(key))}</div>
    </div>
  );
}
