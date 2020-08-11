import React from 'react';
import { Button, Space, Table } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';

import { DefaultLayout, FundraiserCard } from '@components';
import { Fundraiser, FundraiserState, fundraiserStates } from '@types';
import { formatDate, createDate } from '@lib';
import { useStateValue } from '../@app';
import Link from 'next/link';

export default function Fundraisers() {
  const columns = [
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (state) => fundraiserStates[state],
    },
    {
      title: 'Start date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: formatDate,
    },
    {
      title: 'Start date',
      dataIndex: 'endRate',
      key: 'endRate',
      render: formatDate,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, fundraiser: Fundraiser) => (
        <Space size="small">
          <Button size="small" icon={<EyeOutlined />}>
            explore
          </Button>
          <Button size="small" icon={<EditOutlined />}>
            manage
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = [
    {
      token: 'My Awesome Token (MAT)',
      status: FundraiserState.Running,
      startDate: createDate('2020-07-20'),
      endDate: createDate('2021-03-20'),
      softCap: 500000,
      hardCap: 1000000,
      statusText: 'Fundraising in progress',
    },
  ];

  const [{ tokens }, dispatch] = useStateValue();
  const fundraisingTokens = tokens.map;

  const renderHeadExtra = () => (
    <Space>
      <Button type="primary">Start new Fundraiser</Button>
      <Link href="/tokens">
        <Button>Manage my Tokens</Button>
      </Link>
    </Space>
  );
  return (
    <DefaultLayout title="My fundraisers" headExtra={renderHeadExtra()} headTableAligned={true}>
      {tokens.map((token, index) => (
        <div className="mb-3">
          <FundraiserCard token={token} key={index} />
        </div>
      ))}
      {/*<Table columns={columns} dataSource={dataSource} />*/}
    </DefaultLayout>
  );
}
