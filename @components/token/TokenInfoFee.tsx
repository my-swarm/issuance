import React, { useMemo } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { Descriptions, Space, Typography } from 'antd';
import { ReloadOutlined } from '@lib/icons';
import { formatNumber, formatUnits, SWM_TOKEN_DECIMALS } from '@lib';
import { useAppState, useFeeInfo } from '@app';
import { FundraiserFragment } from '@graphql';

const { Text } = Typography;

interface Props {
  fundraiser?: FundraiserFragment;
}

export function TokenInfoFee({ fundraiser }: Props) {
  const [{ onlineToken: token }] = useAppState();
  const value = useMemo(() => {
    return fundraiser
      ? formatUnits(BigNumber.from(fundraiser.amountQualified), fundraiser.baseCurrency.decimals)
      : token.nav;
  }, [fundraiser, token]);
  const { swmBalance, reloadSwmBalance, fee, lowSwmBalance, swmPrice } = useFeeInfo(token.nav);

  const feeStr = fee ? formatUnits(fee, SWM_TOKEN_DECIMALS) + ' SWM' : 'calculating...';
  const valueLabel = fundraiser ? 'Amount Raised' : 'Net Asset Value';

  return (
    <Descriptions layout="vertical" size="small" className="mb-3" bordered column={4}>
      <Descriptions.Item label={valueLabel}>{formatNumber(value)} USD</Descriptions.Item>
      <Descriptions.Item label="Current SWM Price">1 SWM = {swmPrice} USD</Descriptions.Item>
      <Descriptions.Item label="SWM fee">
        <strong>{feeStr}</strong>
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <Space>
            <span>Your SWM balance</span>
            <ReloadOutlined onClick={reloadSwmBalance} />
          </Space>
        }
      >
        <Text type={lowSwmBalance ? 'danger' : undefined}>{swmBalance.nice} SWM</Text>
      </Descriptions.Item>
    </Descriptions>
  );
}
