import React, { ReactElement, useEffect } from 'react';
import { FundraiserStatus, useContributionsLazyQuery } from '@graphql';
import { Button, Drawer, Space, Table, Tooltip } from 'antd';
import { BigNumber } from 'ethers';
import { formatNumber, formatUnits, getClaimableAmount } from '@lib';
import { FundraiserStatusTag, InvestContribute, InvestFundraiserDetails, Loading } from '@components';
import { useDetailAction, useDispatch, useEthers } from '@app';
import { AlignType } from 'rc-table/es/interface';
import { tableColumns } from '../manage/listUtils';

type FundraiserAction = 'fundraiser' | 'contribute';

interface Record {
  label: string | ReactElement;
  address: string;
  status: FundraiserStatus;
  contributed: BigNumber;
  contributedStr: string;
  tokens: BigNumber;
  tokensStr: string;
  referrals: BigNumber;
  referralsStr: string;
}

export function Contributions() {
  const { action, record, handleAction, handleClearAction } = useDetailAction<FundraiserAction, Record>();
  const { dispatchTransaction } = useDispatch();
  const { address } = useEthers();
  const [loadQuery, { data, loading, error }] = useContributionsLazyQuery();

  useEffect(() => {
    if (address) {
      loadQuery({ variables: { address } });
    }
  }, [address]);

  if (loading) return <Loading />;
  const contributions = data?.contributors || [];
  const affiliates = data?.affiliates || [];

  const handleClaim = (address: string) => {
    console.log('claiming', address);
    dispatchTransaction({
      method: 'fundraiser.claimTokens',
      description: 'Claiming tokens...',
      address,
    });
  };

  const columns = tableColumns<Record>([
    {
      title: 'Label',
      key: 'label',
    },
    {
      title: 'Status',
      key: 'status',
      render: (status) => <FundraiserStatusTag status={status} />,
    },
    {
      title: 'Contributed',
      key: 'contributedStr',
      align: 'right' as AlignType,
    },
    {
      title: 'Tokens to claim',
      key: 'tokensStr',
      align: 'right' as AlignType,
      render: (amount, record) => {
        if (record.status === FundraiserStatus.Finished) {
          return amount;
        } else {
          return (
            <Tooltip title="Approximation based on current fundraiser status!">
              <i>{amount}</i>
            </Tooltip>
          );
        }
      },
    },
    {
      title: 'Referrals',
      key: 'referralsStr',
      align: 'right' as AlignType,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right' as AlignType,
      render: (_value: unknown, record: Record) => (
        <Space size="small">
          {record.status === FundraiserStatus.Finished && record.tokens.gt(0) && (
            <Button size="small" onClick={() => handleClaim(record.address)}>
              Claim tokens
            </Button>
          )}
          {record.status === FundraiserStatus.Running && (
            <Button size="small" onClick={() => handleAction('contribute', record)}>
              Contribute more
            </Button>
          )}
          <Button size="small" onClick={() => handleAction('fundraiser', record)}>
            Fundraiser details
          </Button>
        </Space>
      ),
    },
  ]);

  function getActionTitle() {
    if (!record) return null;
    return <strong>{record.label}</strong>;
  }

  function renderAction() {
    if (!record) return null;

    switch (action) {
      case 'fundraiser':
        return <InvestFundraiserDetails id={record.address} />;
      case 'contribute':
        return <InvestContribute id={record.address} />;
    }
  }

  const datasource: Record[] = (contributions || []).map((contributor) => {
    const { fundraiser } = contributor;
    const { baseCurrency, token } = fundraiser;
    const contributed = contributor.amount;
    const tokens = getClaimableAmount(fundraiser, contributed).sub(contributor.amountClaimed);
    const referral = affiliates.find((aff) => aff.fundraiser.id === fundraiser.id);
    const referrals = referral
      ? BigNumber.from(referral.amount).sub(BigNumber.from(referral.amountClaimed))
      : BigNumber.from(0);
    return {
      label: (
        <Space>
          <strong>{token.symbol}</strong>
          <span>{token.name}</span>
          <span>({fundraiser.label})</span>
        </Space>
      ),
      address: fundraiser.address,
      status: fundraiser.status,
      contributed,
      tokens,
      referrals,
      contributedStr:
        formatNumber(formatUnits(BigNumber.from(contributed), baseCurrency.decimals), 4) + ' ' + baseCurrency.symbol,
      tokensStr: formatNumber(formatUnits(BigNumber.from(tokens), token.decimals), 4) + ' ' + token.symbol,
      referralsStr:
        formatNumber(formatUnits(BigNumber.from(referrals), baseCurrency.decimals), 4) + ' ' + baseCurrency.symbol,
    };
  });

  return (
    <>
      <Table dataSource={datasource} columns={columns} pagination={false} />
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
