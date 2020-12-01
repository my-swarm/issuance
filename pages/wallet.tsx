import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Drawer, Space, Table } from 'antd';
import { DollarCircleOutlined } from '@ant-design/icons';

import { DefaultLayout, Loading, WalletDetail } from '@components';
import { TokenHolderFragment, TokenInfoFragment, TransferFragment, useWalletLazyQuery } from '@graphql';
import { formatUnits } from '@lib';
import { useEthers, useGraphql } from '@app';
import { AlignType } from 'rc-table/es/interface';

enum WalletAction {
  Detail,
}

export type WalletRecord = {
  token: TokenInfoFragment;
  holder: TokenHolderFragment;
  transfers: TransferFragment[];
};

export type Wallet = WalletRecord[];

function mergeTransfers(t1: TransferFragment[], t2: TransferFragment[]): TransferFragment[] {
  return [...t1, ...t2].sort((a, b) => b.createdAt - a.createdAt);
}

export default function WalletPage(): ReactElement {
  const [action, setAction] = useState<WalletAction>();
  const [record, setRecord] = useState<WalletRecord>();
  const { address } = useEthers();
  const { reset } = useGraphql();
  const [loadQuery, { data, loading, error }] = useWalletLazyQuery();

  useEffect(() => {
    if (address) {
      loadQuery({ variables: { address } });
    }
  }, [address]);

  if (loading) return <Loading />;

  const handleAction = (newAction: WalletAction, record: WalletRecord) => {
    setRecord(record);
    setAction(newAction);
  };

  const handleClearAction = () => {
    setAction(undefined);
  };

  const wallet: Wallet = (data?.tokenHolders || []).map((tokenHolder) => {
    const { transfersFrom, transfersTo } = tokenHolder.token;
    return {
      token: tokenHolder.token,
      holder: tokenHolder as TokenHolderFragment,
      transfers: mergeTransfers(transfersFrom, transfersTo),
    };
  });

  console.log({ wallet });

  const columns = [
    {
      title: 'Image',
      key: 'image',
      render: () => <DollarCircleOutlined style={{ fontSize: '24px' }} />,
    },
    {
      title: 'Token',
      key: 'token',
      render: ({ token }) => (
        <>
          <Space>
            <strong>{token.symbol}</strong>
            <span>{token.name}</span>
          </Space>
        </>
      ),
    },
    {
      title: 'Balance',
      key: 'balance',
      align: 'right' as AlignType,
      render: ({ holder, token }) => formatUnits(holder.balance, token.decimals),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right' as AlignType,
      render: (record) => (
        <Space size="small">
          <Button size="small" onClick={() => handleAction(WalletAction.Detail, record)}>
            Detail
          </Button>{' '}
        </Space>
      ),
    },
  ];

  function getActionTitle() {
    if (!record) return null;

    const { token } = record;
    switch (action) {
      case WalletAction.Detail:
        return (
          <Space>
            <strong>{token.symbol}</strong>
            <span>{token.name}</span>
          </Space>
        );
    }
  }

  function renderAction() {
    if (!record) return null;

    const { token, transfers, holder } = record;
    switch (action) {
      case WalletAction.Detail:
        return <WalletDetail token={token} transfers={transfers} holder={holder} onReset={() => reset()} />;
    }
  }

  return (
    <DefaultLayout title="Wallet">
      <Table dataSource={wallet} columns={columns} />
      <Drawer
        title={getActionTitle()}
        visible={action !== undefined}
        width="50%"
        closable={true}
        onClose={() => handleClearAction()}
      >
        {renderAction()}
      </Drawer>{' '}
    </DefaultLayout>
  );
}
