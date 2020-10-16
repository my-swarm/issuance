import React, { ReactElement } from 'react';
import { Descriptions } from 'antd';
import { formatNumber } from '@lib';
import { useAppState } from '@app';

export function TokenInfoGeneral(): ReactElement {
  const [{ token }] = useAppState();

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
