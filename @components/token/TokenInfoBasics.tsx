import React, { ReactElement } from 'react';
import { transferRules } from '@types';
import { Descriptions } from 'antd';
import { formatNumber } from '@lib';
import { tokenFeatures } from '@const';
import { useAppState } from '@app';

export function TokenInfoBasics(): ReactElement {
  const [{ token }] = useAppState();

  const features = Object.entries(tokenFeatures)
    .filter(([key, value]) => token[key])
    .map(([key, value]) => value);

  return (
    <Descriptions title="Basic info" layout="horizontal" bordered size="small" className="c-token-info mb-3" column={2}>
      <Descriptions.Item label="Token name">{token.name}</Descriptions.Item>
      <Descriptions.Item label="Token symbol">{token.symbol}</Descriptions.Item>
      <Descriptions.Item label="Token description">{token.description}</Descriptions.Item>
      <Descriptions.Item label="Token image">
        <div className="image-preview">
          {token.image?.content ? <img src={token.image.content} alt="Token" /> : '-'}
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="Decimals">{token.decimals}</Descriptions.Item>
      <Descriptions.Item label="Initial Token supply">
        {formatNumber(token.initialSupply)} {token.symbol}
      </Descriptions.Item>
      <Descriptions.Item label="Transfer restrictions">
        {transferRules[token.transferRestrictionsType]}
      </Descriptions.Item>
      <Descriptions.Item label="Features">{features.join(', ')}</Descriptions.Item>
    </Descriptions>
  );
}
