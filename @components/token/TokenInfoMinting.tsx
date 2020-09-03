import React from 'react';
import { Token } from '@types';
import { Descriptions } from 'antd';
import { formatNumber } from '@lib';

export function TokenInfoMinting({ token }: { token: Token }) {
  return (
    <Descriptions title="Minting information" layout="vertical" size="small" className="mb-3">
      <Descriptions.Item label="Initial Token supply">
        {formatNumber(token.initialSupply)} {token.symbol}
      </Descriptions.Item>
      <Descriptions.Item label="Future minting allowed">{token.allowMint ? 'Yes' : 'No'}</Descriptions.Item>
      <Descriptions.Item label="Maximum supply">
        {token.allowUnlimitedSupply ? 'Unlimited' : formatNumber(token.totalSupply || token.initialSupply)}{' '}
        {token.symbol}
      </Descriptions.Item>
    </Descriptions>
  );
}
