import React, { ReactElement, useMemo } from 'react';
import { Descriptions } from 'antd';
import { formatNumber, transferRules, tokenFeatures, formatUnits } from '@lib';
import { useAppState, useKya } from '@app';
import { ImagePreview, Loading } from '../utility';

export function TokenInfoBasics(): ReactElement {
  const [{ onlineToken, localToken }] = useAppState();
  const { kya, nav } = useKya();

  if (!kya) return <Loading />;

  const token = onlineToken || localToken;

  function renderLocalTokenInfo() {
    const features = Object.entries(tokenFeatures)
      .filter(([key, value]) => localToken[key])
      .map(([key, value]) => value);

    return (
      <>
        <Descriptions.Item label="Max Token supply">
          {localToken.totalSupply ? `${formatNumber(localToken.totalSupply)} ${token.symbol}` : 'unlimited'}
        </Descriptions.Item>
        <Descriptions.Item label="Transfer restrictions">
          {transferRules[localToken.transferRestrictionsType]}
        </Descriptions.Item>
        <Descriptions.Item label="Features">{features.join(', ')}</Descriptions.Item>
      </>
    );
  }

  function renderOnlineTokenInfo() {
    const features = [];
    if (onlineToken.features.accountFreeze) features.push(tokenFeatures.allowAccountFreeze);
    if (onlineToken.features.accountBurn) features.push(tokenFeatures.allowBurn);
    if (onlineToken.features.forceTransfer) features.push(tokenFeatures.allowForceTransfer);
    if (onlineToken.features.tokenFreeze) features.push(tokenFeatures.allowContractFreeze);
    return (
      <>
        <Descriptions.Item label="Current supply">
          {formatNumber(onlineToken.supply)} {token.symbol}
        </Descriptions.Item>
        <Descriptions.Item label="Maximum supply">
          {formatNumber(formatUnits(onlineToken.maxSupply, token.decimals))} {token.symbol}
        </Descriptions.Item>
        <Descriptions.Item label="Available supply">
          {formatNumber(onlineToken.availableSupply)} {token.symbol}
        </Descriptions.Item>
        <Descriptions.Item label="Features">{features.join(', ')}</Descriptions.Item>
      </>
    );
  }

  return (
    <Descriptions title="Basic info" layout="horizontal" bordered size="small" className="c-token-info mb-3" column={1}>
      <Descriptions.Item label="Token name">{token.name}</Descriptions.Item>
      <Descriptions.Item label="Token symbol">{token.symbol}</Descriptions.Item>
      <Descriptions.Item label="Token description">{kya.token.description}</Descriptions.Item>
      <Descriptions.Item label="Token image">
        <ImagePreview image={kya.token.image} />
      </Descriptions.Item>
      <Descriptions.Item label="Decimals">{token.decimals}</Descriptions.Item>
      {localToken ? renderLocalTokenInfo() : renderOnlineTokenInfo()}
    </Descriptions>
  );
}
