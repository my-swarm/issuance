import React, { useEffect, useMemo, useState } from 'react';
import { Typography, Button, Descriptions, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
const { Text } = Typography;

import { formatNumber, formatUnits, SWM_TOKEN_DECIMALS } from '@lib';
import { useAppState } from '@app';
import { useStakeInfo } from '../../@app/useStakeInfo';

export function TokenInfoStaking() {
  const [{ onlineToken: token }] = useAppState();
  const { swmBalance, reloadSwmBalance, stake, lowSwmBalance, swmPrice } = useStakeInfo();

  const stakeStr = stake ? formatUnits(stake, SWM_TOKEN_DECIMALS) + ' SWM' : 'calculating...';

  return (
    <Descriptions title="Staking information" layout="vertical" size="small" className="mb-3" bordered column={4}>
      <Descriptions.Item label="Net Asset Value">{formatNumber(token.nav)} USD</Descriptions.Item>
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
