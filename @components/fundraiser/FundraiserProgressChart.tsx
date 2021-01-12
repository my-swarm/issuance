import React, { ReactElement } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  LineProps,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { ContributorFragment, FundraiserWithContributorsFragment } from '@graphql';
import dayjs from 'dayjs';
import _ from 'lodash';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@lib';
import { colors } from '@app';

interface FundraiserChartProps {
  fundraiser: FundraiserWithContributorsFragment;
}

type ChartRecord = {
  date?: string;
  qualified: BigNumber | number;
  pending: BigNumber | number;
  removed: BigNumber | number;
  refunded: BigNumber | number;
};

type ChartData = ChartRecord[];

const emptyRow: ChartRecord = {
  qualified: BigNumber.from(0),
  pending: BigNumber.from(0),
  removed: BigNumber.from(0),
  refunded: BigNumber.from(0),
};

const lineAttrs: Partial<LineProps> = {
  type: 'monotone',
  strokeWidth: 2,
  activeDot: { r: 6 },
};

function aggregateDailyContributions(contributors: ContributorFragment[]): ChartData {
  const result: { [index: string]: ChartRecord } = {};
  for (const contributor of contributors) {
    const { status, contributions } = contributor;
    for (const contribution of contributions) {
      if (contribution.type === status) {
        const date = dayjs.unix(contribution.timestamp).format('YYYY/MM/DD');
        const row = result[date] || { date, ...emptyRow };
        const key = status.toLowerCase();
        row[key] = row[key].add(contribution.amount);
        result[date] = row;
      }
    }
  }
  return Object.values(result);
}

function sumDailyContribution(data: ChartData) {
  const sortedData = _.sortBy(data, ['date']);
  const result: ChartData = [];
  const sum = { ...emptyRow };
  for (const row of sortedData) {
    for (const key of Object.keys(emptyRow)) {
      sum[key] = sum[key].add(row[key]);
    }
    result.push({ date: row.date, ...sum });
  }

  return result;
}

function dataToNumbers(data: ChartData, decimals): ChartData {
  const result: ChartData = [];
  for (const row of data) {
    const resRow = { ...row };
    for (const key of Object.keys(emptyRow)) resRow[key] = parseFloat(formatUnits(row[key], decimals));
    result.push(resRow);
  }
  return result;
}

function contributorsToChartData(contributors: ContributorFragment[], decimals: number): ChartData {
  return dataToNumbers(sumDailyContribution(aggregateDailyContributions(contributors)), decimals);
}

export function FundraiserProgressChart({ fundraiser }: FundraiserChartProps): ReactElement {
  const { baseCurrency } = fundraiser;
  const data = contributorsToChartData(fundraiser.contributors, baseCurrency.decimals);
  const softCap = parseFloat(formatUnits(fundraiser.softCap, baseCurrency.decimals));
  const hardCap = parseFloat(formatUnits(fundraiser.hardCap, baseCurrency.decimals));

  return (
    <ResponsiveContainer minWidth={300} height={200} width="99%">
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <CartesianGrid strokeDasharray="1 2" strokeWidth={1} />
        <Line {...lineAttrs} dataKey="qualified" stroke={colors.green} />
        <Line {...lineAttrs} dataKey="pending" stroke={colors.blue} />
        <ReferenceLine y={softCap} label="Soft Cap" stroke={colors.green} strokeDasharray="2 2" />
        <ReferenceLine
          y={hardCap}
          label="Hard Cap"
          stroke={colors.red}
          ifOverflow="extendDomain"
          strokeDasharray="2 2"
        />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
}
