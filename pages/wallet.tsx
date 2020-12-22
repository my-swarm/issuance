import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Checkbox, Drawer, Space, Table } from 'antd';
import { DollarCircleOutlined } from '@ant-design/icons';

import { DefaultLayout, Loading, RequireEthers, WalletDetail } from '@components';
import { TokenHolderFragment, TokenInfoFragment, TransferFragment, useWalletLazyQuery } from '@graphql';
import { formatUnits } from '@lib';
import { useContract, useEthers, useGraphql } from '@app';
import { AlignType } from 'rc-table/es/interface';
import { BigNumber } from 'ethers';

enum WalletAction {
  Detail,
}

export type WalletRecord = {
  image?: string;
  token: TokenInfoFragment;
  holder: TokenHolderFragment;
  transfers?: TransferFragment[];
  special: boolean;
};

export type Wallet = WalletRecord[];

function mergeTransfers(t1: TransferFragment[], t2: TransferFragment[]): TransferFragment[] {
  return [...t1, ...t2].sort((a, b) => b.createdAt - a.createdAt);
}

interface Filter {
  nonzeroBalance: boolean;
}

const defaultFilter: Filter = {
  nonzeroBalance: false,
};

export default function WalletPage(): ReactElement {
  const [action, setAction] = useState<WalletAction>();
  const [record, setRecord] = useState<WalletRecord>();
  const [ethBalance, setEthBalance] = useState<BigNumber>();
  const [swmBalance, setSwmBalance] = useState<BigNumber>();
  const [usdcBalance, setUsdcBalance] = useState<BigNumber>();
  const [filter, setFilter] = useState<Filter>(defaultFilter);
  const { usdc, swm } = useContract();
  const { connected, address, signer } = useEthers();
  const { reset } = useGraphql();
  const [loadQuery, { data, loading, error }] = useWalletLazyQuery();

  useEffect(() => {
    if (address) {
      loadQuery({ variables: { address } });
    }
  }, [address]);

  useEffect(() => {
    if (address && signer && usdc && swm) {
      signer.getBalance().then(setEthBalance);
      usdc.balanceOf(address).then(setUsdcBalance);
      swm.balanceOf(address).then(setSwmBalance);
    }
  }, [address, signer, usdc, swm]);

  if (loading) return <Loading />;

  const handleAction = (newAction: WalletAction, record: WalletRecord) => {
    setRecord(record);
    setAction(newAction);
  };

  const handleClearAction = () => {
    setAction(undefined);
  };

  const handleUpdateFilter = (prop: string, value: boolean) => {
    setFilter({ ...filter, [prop]: value });
  };

  let wallet: Wallet;
  if (filter.nonzeroBalance) {
    wallet = (data?.tokenHolders || []).map((tokenHolder) => {
      const { transfersFrom, transfersTo } = tokenHolder.token;
      return {
        token: tokenHolder.token,
        holder: tokenHolder as TokenHolderFragment,
        transfers: mergeTransfers(transfersFrom, transfersTo),
        special: false,
      };
    });
  } else {
    wallet = (data?.tokens || []).map((token) => {
      const { transfersFrom, transfersTo } = token;
      const { holders } = token;
      const holder = holders[0];
      return {
        token,
        holder: holder as TokenHolderFragment,
        transfers: mergeTransfers(transfersFrom, transfersTo),
        special: false,
      };
    });
  }

  if (!filter.nonzeroBalance || ethBalance.gt(0)) {
    wallet.unshift({
      token: { name: 'Swarm Token', symbol: 'SWM', decimals: 18 } as TokenInfoFragment,
      holder: { balance: swmBalance } as TokenHolderFragment,
      special: true,
      image: '/images/swarm-symbol.svg',
    });
  }
  if (!filter.nonzeroBalance || usdcBalance.gt(0)) {
    wallet.unshift({
      token: { name: 'Stable Coin', symbol: 'USDC', decimals: 6 } as TokenInfoFragment,
      holder: { balance: usdcBalance } as TokenHolderFragment,
      special: true,
      image: '/images/usdc.svg',
    });
  }
  if (!filter.nonzeroBalance || swmBalance.gt(0)) {
    wallet.unshift({
      token: { name: 'Ethereum', symbol: 'ETH', decimals: 18 } as TokenInfoFragment,
      holder: { balance: ethBalance } as TokenHolderFragment,
      special: true,
      image: '/images/ethereum.svg',
    });
  }

  const columns = [
    {
      title: 'Image',
      key: 'image',
      render: ({ token, image }) =>
        image ? (
          <img src={image} alt={`${token.symbol} logo`} />
        ) : (
          <DollarCircleOutlined style={{ fontSize: '24px' }} />
        ),
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
      render: ({ holder, token }) => (holder ? formatUnits(holder.balance, token.decimals) : 'N/A'),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right' as AlignType,
      render: (record) =>
        !record.special &&
        connected && (
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
      {connected && (
        <p>
          <Checkbox
            checked={filter.nonzeroBalance}
            onChange={(val) => handleUpdateFilter('nonzeroBalance', val.target.checked)}
          >
            Show non-zero balances only
          </Checkbox>
        </p>
      )}
      <Table
        dataSource={wallet}
        columns={columns}
        className="wallet-table"
        rowClassName={(record) => record.special && 'special'}
      />
      <RequireEthers message="The balances will only show when you connect to Ethereum" />
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
