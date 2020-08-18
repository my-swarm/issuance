import React, { ReactElement } from 'react';
import { Token } from '@types';
import { Descriptions } from 'antd';
import { formatNumber } from '@lib';

export function TokenInfoGeneral({ token }: { token: Token }): ReactElement {
  return (
    <Descriptions title="General token info" layout="vertical" size="small" className="mb-3">
      <Descriptions.Item label="Initial Token supply">
        {formatNumber(token.initialSupply)} {token.symbol}
      </Descriptions.Item>
      <Descriptions.Item label="Initial token price">{formatNumber(123, 3)} USD</Descriptions.Item>
      <Descriptions.Item label="Future minting allowed">{token.allowMint ? 'Yes' : 'No'}</Descriptions.Item>
    </Descriptions>
  );
}
