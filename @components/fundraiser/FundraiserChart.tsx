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
import { ContributorFragment, FundraiserFragment } from '@graphql';
import moment from 'moment';
import _ from 'lodash';
import { formatUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';
import { BASE_CURRENCIES } from '@const';

interface FundraiserChartProps {
  fundraiser: FundraiserFragment;
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
const palette = { qualified: '#82ca9d', pending: '#8884d8', hardCap: 'red', softCap: 'green' };

function aggregateDailyContributions(contributors: ContributorFragment[]): ChartData {
  const result: { [index: string]: ChartRecord } = {};
  for (const contributor of contributors) {
    const { status, contributions } = contributor;
    for (const contribution of contributions) {
      if (contribution.type === status) {
        const date = moment.unix(contribution.timestamp).format('YYYY/MM/DD');
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
  console.log({ sortedData });
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

export function FundraiserChart({ fundraiser }: FundraiserChartProps): ReactElement {
  const baseCurrency = BASE_CURRENCIES.USDC;
  const data = contributorsToChartData(fundraiser.contributors, baseCurrency.decimals);
  const softCap = parseFloat(formatUnits(fundraiser.softCap, baseCurrency.decimals));
  const hardCap = parseFloat(formatUnits(fundraiser.hardCap, baseCurrency.decimals));

  return (
    <ResponsiveContainer minWidth={300} height={200} width="99%">
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <CartesianGrid strokeDasharray="1 2" strokeWidth={1} />
        <Line {...lineAttrs} dataKey="qualified" stroke={palette.qualified} />
        <Line {...lineAttrs} dataKey="pending" stroke={palette.pending} />
        <ReferenceLine y={softCap} label="Soft Cap" stroke={palette.softCap} strokeDasharray="2 2" />
        <ReferenceLine
          y={hardCap}
          label="Hard Cap"
          stroke={palette.hardCap}
          ifOverflow="extendDomain"
          strokeDasharray="2 2"
        />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
}
