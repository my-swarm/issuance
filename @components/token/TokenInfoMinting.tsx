import React, { ReactElement } from 'react';
import { Descriptions } from 'antd';
import { formatNumber } from '@lib';
import { useAppState } from '@app';

export function TokenInfoMinting(): ReactElement {
  const [{ localToken, onlineToken: token }] = useAppState();

  if (!localToken) return null;

  return (
    <Descriptions title="Minting information" layout="vertical" size="small" className="mb-3" bordered column={3}>
      <Descriptions.Item label="Max Token supply">
        {formatNumber(localToken.totalSupply)} {token.symbol}
      </Descriptions.Item>
      <Descriptions.Item label="Future minting allowed">{localToken.allowMint ? 'Yes' : 'No'}</Descriptions.Item>
      <Descriptions.Item label="Maximum supply">
        {localToken.allowUnlimitedSupply ? 'Unlimited' : formatNumber(localToken.totalSupply)} {token.symbol}
      </Descriptions.Item>
    </Descriptions>
  );
}
