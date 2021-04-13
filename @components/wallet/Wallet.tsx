import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Drawer, Space, Table } from 'antd';
import { AlignType } from 'rc-table/es/interface';
import { BigNumber } from '@ethersproject/bignumber';

import { FundraiserStatus, TokenInfoFragment, useWalletLazyQuery } from '@graphql';
import { formatNumber, formatUnits, getClaimableAmount } from '@lib';
import { DollarCircleOutlined } from '@lib/icons';
import { useContract, useDetailAction, useEthers, useGraphql } from '@app';
import { DefaultLayout, Loading, RequireEthers, WalletDetail } from '..';
import { tableColumns } from '../manage/listUtils';

enum WalletAction {
  Detail,
}

export type WalletRecord = {
  image?: string;
  token: TokenInfoFragment;
  balance: BigNumber;
  claimable: BigNumber;
  referrals: BigNumber;
  special: boolean;
};

function createSpecialRecord(symbol, name, decimals, balance): WalletRecord {
  return {
    token: { symbol, name, decimals } as TokenInfoFragment,
    balance: balance,
    claimable: BigNumber.from(0),
    referrals: BigNumber.from(0),
    special: true,
    image: `/images/coins/${symbol}.svg`,
  };
}

export function Wallet(): ReactElement {
  const { action, record, handleAction, handleClearAction } = useDetailAction<WalletAction, WalletRecord>();
  const [ethBalance, setEthBalance] = useState<BigNumber>();
  const [swmBalance, setSwmBalance] = useState<BigNumber>();
  const [usdcBalance, setUsdcBalance] = useState<BigNumber>();
  const { usdc, swm } = useContract();
  const { connected, address, signer } = useEthers();
  const { reset } = useGraphql();
  const [loadQuery, { data, loading }] = useWalletLazyQuery();

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

  let wallet: WalletRecord[] = (data?.tokenHolders || []).map((tokenHolder) => {
    return {
      token: tokenHolder.token,
      balance: tokenHolder.balance,
      claimable: BigNumber.from(0),
      referrals: BigNumber.from(0),
      special: false,
    };
  });
  /*
  for (const contributor of data?.contributors || []) {
    const { fundraiser, amount } = contributor;
    if (fundraiser.status !== FundraiserStatus.Finished) continue;
    const claimable = getClaimableAmount(fundraiser, amount);
    const record = wallet.find((x) => x.token.address === fundraiser.token.address);
    if (record) {
      record.claimable = claimable;
    } else {
      wallet.push({
        token: contributor.fundraiser.token,
        balance: BigNumber.from(0),
        claimable: claimable,
        referrals: BigNumber.from(0),
        special: false,
      });
    }
  }
*/
  wallet = [
    createSpecialRecord('ETH', 'Ethereum', 18, ethBalance),
    createSpecialRecord('USDC', 'Stable Coin', 18, usdcBalance),
    createSpecialRecord('SWM', 'Swarm Token', 18, swmBalance),
    ...wallet,
  ];

  const columns = tableColumns<WalletRecord>([
    {
      title: 'Image',
      key: 'image',
      render: (image, { token }) =>
        image ? (
          <img src={image} alt={`${token.symbol} logo`} />
        ) : (
          <DollarCircleOutlined style={{ fontSize: '24px' }} />
        ),
    },
    {
      title: 'Token',
      key: 'token',
      render: (token) => (
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
      render: (balance, { token }) => (balance ? formatNumber(formatUnits(balance, token.decimals), 4) : 'N/A'),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right' as AlignType,
      render: (_value: unknown, record) =>
        !record.special &&
        connected && (
          <Space size="small">
            <Button size="small" onClick={() => handleAction(WalletAction.Detail, record)}>
              Detail
            </Button>{' '}
          </Space>
        ),
    },
  ]);

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

    const { token } = record;
    switch (action) {
      case WalletAction.Detail:
        return <WalletDetail token={token} onReset={() => reset()} />;
    }
  }

  function rowClassName(record) {
    return record.special && record.token.symbol.toLowerCase();
  }

  return (
    <>
      <Table
        dataSource={wallet}
        columns={columns}
        className="wallet-table"
        rowClassName={rowClassName}
        pagination={false}
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
      </Drawer>
    </>
  );
}
