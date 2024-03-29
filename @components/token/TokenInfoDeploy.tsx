import React, { ReactElement } from 'react';
import { Descriptions } from 'antd';
import { formatNumber } from '@lib';
import { useAppState } from '@app';

export function TokenInfoDeploy(): ReactElement {
  const [{ localToken }] = useAppState();

  return (
    <Descriptions title="General token info" layout="vertical" size="small" className="mb-3">
      <Descriptions.Item label="Max Token supply">
        {localToken.totalSupply ? `${formatNumber(localToken.totalSupply)} ${localToken.symbol}` : 'unlimited'}
      </Descriptions.Item>
      <Descriptions.Item label="Initial token price">{formatNumber(123, 3)} USD</Descriptions.Item>
      <Descriptions.Item label="Future minting allowed">{localToken.allowMint ? 'Yes' : 'No'}</Descriptions.Item>
    </Descriptions>
  );
}
