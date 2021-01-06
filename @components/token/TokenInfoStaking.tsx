import React, { useEffect, useMemo, useState } from 'react';
import { BigNumber, BigNumberish } from 'ethers';
import { Typography, Button, Descriptions, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
const { Text } = Typography;

import { formatNumber, formatUnits, SWM_TOKEN_DECIMALS } from '@lib';
import { useAppState } from '@app';
import { useStakeInfo } from '../../@app/useStakeInfo';
import { FundraiserFragment } from '@graphql';

interface Props {
  fundraiser?: FundraiserFragment;
}

export function TokenInfoStaking({ fundraiser }: Props) {
  const [{ onlineToken: token }] = useAppState();
  const value = useMemo(() => {
    return fundraiser
      ? formatUnits(BigNumber.from(fundraiser.amountQualified), fundraiser.baseCurrency.decimals)
      : token.nav;
  }, [fundraiser, token]);
  const { swmBalance, reloadSwmBalance, stake, lowSwmBalance, swmPrice } = useStakeInfo(token.nav);

  const stakeStr = stake ? formatUnits(stake, SWM_TOKEN_DECIMALS) + ' SWM' : 'calculating...';
  const valueLabel = fundraiser ? 'Amount Raised' : 'Net Asset Value';

  return (
    <Descriptions title="Staking information" layout="vertical" size="small" className="mb-3" bordered column={4}>
      <Descriptions.Item label={valueLabel}>{formatNumber(value)} USD</Descriptions.Item>
      <Descriptions.Item label="Current SWM Price">1 SWM = {swmPrice} USD</Descriptions.Item>
      <Descriptions.Item label="Amount of SWM to stake">
        <strong>{stakeStr}</strong>
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
