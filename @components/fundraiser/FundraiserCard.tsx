import React, { ReactElement } from 'react';
import { Card, Space, Descriptions } from 'antd';
import { Token } from '@types';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, Legend, Tooltip } from 'recharts';

interface FundraiserCardProps {
  token: Token;
}

export function FundraiserCard({ token }: FundraiserCardProps): ReactElement {
  const extra = <a href="#">Manage</a>;

  const data = [
    { date: '2020-08-01', raised: 100 },
    { date: '2020-08-02', raised: 200 },
    { date: '2020-08-03', raised: 400 },
    { date: '2020-08-04', raised: 500 },
    { date: '2020-08-05', raised: 800 },
    { date: '2020-08-06', raised: 900 },
  ];

  const chartPalette = ['#8884d8', '#82ca9d'];
  const chartStyle = {
    activeDot: {
      r: 6,
    },
  };

  return (
    <Card title={token.name} extra={extra}>
      <Space size="middle" align="start">
        <LineChart width={400} height={200} data={data}>
          <CartesianGrid strokeDasharray="1 2" strokeWidth={1} />
          <Line
            type="monotone"
            dataKey="raised"
            stroke={chartPalette[0]}
            activeDot={chartStyle.activeDot}
            strokeWidth={2}
          />
          <Tooltip />
        </LineChart>
        <Descriptions title="Fundraiser Info">
          <Descriptions.Item label="Start Date">20.8.2020</Descriptions.Item>
          <Descriptions.Item label="End Date">20.8.2020</Descriptions.Item>
          <Descriptions.Item label="Soft cap">500,000 USD</Descriptions.Item>
          <Descriptions.Item label="Hard cap">1,000,000 USD</Descriptions.Item>
          <Descriptions.Item label="Raised so far">320,000 USD (32%)</Descriptions.Item>
        </Descriptions>
      </Space>
    </Card>
  );
}
