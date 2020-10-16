import React, { ReactElement } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Card, Space, Descriptions } from 'antd';
import { Token } from '@types';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, Legend, Tooltip, LineProps, ReferenceLine } from 'recharts';
import { ContributorFragment, ContributorStatus, FundraiserFragment } from '../../@graphql';
import { formatDate, formatNumber, getContractAddress } from '../../@lib';
import { formatUnits } from 'ethers/lib/utils';
import { useAppState, useEthers } from '@app';
import { BigNumber } from 'ethers';
import { BASE_CURRENCIES } from '@const';

interface FundraiserCardProps {
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

export function FundraiserCard({ fundraiser }: FundraiserCardProps): ReactElement {
  const { networkId } = useEthers();
  const [{ tokens }] = useAppState();
  const extra = <a href="#">Manage</a>;

  const lineAttrs: Partial<LineProps> = {
    type: 'monotone',
    strokeWidth: 2,
    activeDot: { r: 6 },
  };
  const palette = { qualified: '#82ca9d', pending: '#8884d8', hardCap: 'red', softCap: 'green' };

  const token = tokens.find((t) => t.networks[networkId]?.addresses?.src20 === fundraiser.token.id);
  const baseCurrency = BASE_CURRENCIES.USDC;
  const data2 = aggregateDailyContributions(fundraiser.contributors);
  const data3 = sumDailyContribution(data2);
  const data = dataToNumbers(data3, baseCurrency.decimals);
  console.log({ data2, data3, data });

  const softCap = parseFloat(formatUnits(fundraiser.softCap, baseCurrency.decimals));
  const hardCap = parseFloat(formatUnits(fundraiser.hardCap, baseCurrency.decimals));
  const amountQualified = parseFloat(formatUnits(fundraiser.amountQualified, baseCurrency.decimals));
  const raisedPercent = (amountQualified / softCap) * 100;
  return (
    <Card title={fundraiser.label} extra={extra}>
      <Space size="middle" align="start">
        <LineChart width={400} height={200} data={data}>
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
        <Descriptions title="Fundraiser Info" column={1} size="small">
          <Descriptions.Item label="Start Date">{formatDate(fundraiser.startDate)}</Descriptions.Item>
          <Descriptions.Item label="End Date">{formatDate(fundraiser.endDate)}</Descriptions.Item>
          <Descriptions.Item label="Soft cap">{softCap} USD</Descriptions.Item>
          <Descriptions.Item label="Hard cap">{hardCap} USD</Descriptions.Item>
          <Descriptions.Item label="Raised so far">
            {amountQualified} USD ({formatNumber(raisedPercent, 2)} %)
          </Descriptions.Item>
        </Descriptions>
      </Space>
    </Card>
  );
}
