import React, { ReactElement } from 'react';
import { Descriptions } from 'antd';
import { BigNumber } from '@ethersproject/bignumber';
import { formatNumber, formatUnits, tokenFeatures, formatDatetime, tokenBalance } from '@lib';
import { useAppState, useEthers, useKya } from '@app';
import { ImagePreview, Loading } from '../utility';

export function TokenInfoBasics(): ReactElement {
  const { block } = useEthers();
  const [{ onlineToken, localToken }] = useAppState();
  const { kya } = useKya();

  if (!kya) return <Loading message="Loading token info" />;

  const token = onlineToken || localToken;

  function renderLocalTokenInfo() {
    const features = Object.entries(tokenFeatures)
      .filter(([key, value]) => localToken[key])
      .map(([key, value]) => value);

    return (
      <>
        <Descriptions.Item label="Max Token supply">
          {localToken.totalSupply ? `${formatNumber(localToken.totalSupply)} ${token.symbol}` : 'Unlimited'}
        </Descriptions.Item>
        <Descriptions.Item label="Features">{features.join(', ')}</Descriptions.Item>
        {localToken.autoburnTs && (
          <Descriptions.Item label="Automatic Burn time">{formatDatetime(localToken.autoburnTs)}</Descriptions.Item>
        )}
      </>
    );
  }

  function renderOnlineTokenInfo() {
    const features = [];
    if (onlineToken.features.accountFreeze) features.push(tokenFeatures.allowAccountFreeze);
    if (onlineToken.features.accountBurn) features.push(tokenFeatures.allowBurn);
    if (onlineToken.features.forceTransfer) features.push(tokenFeatures.allowForceTransfer);
    if (onlineToken.features.tokenFreeze) features.push(tokenFeatures.allowContractFreeze);
    if (onlineToken.features.autoburn) features.push(tokenFeatures.allowAutoburn);
    return (
      <>
        <Descriptions.Item label="Current supply">
          {formatNumber(formatUnits(onlineToken.supply, onlineToken.decimals))} {token.symbol}
        </Descriptions.Item>
        <Descriptions.Item label="Maximum supply">
          {BigNumber.from(onlineToken.maxSupply).eq(0)
            ? 'Unlimited'
            : formatNumber(formatUnits(onlineToken.maxSupply, token.decimals)) + ' ' + token.symbol}
        </Descriptions.Item>
        <Descriptions.Item label="Available supply">
          {formatNumber(formatUnits(tokenBalance(block, onlineToken, onlineToken.availableSupply), token.decimals))}{' '}
          {token.symbol}
        </Descriptions.Item>
        <Descriptions.Item label="Features">{features.join(', ')}</Descriptions.Item>
        {onlineToken.features.autoburnTs && (
          <Descriptions.Item label="Automatic Burn time">
            {formatDatetime(onlineToken.features.autoburnTs)}
          </Descriptions.Item>
        )}
      </>
    );
  }

  return (
    <Descriptions
      title="Basic info"
      layout="horizontal"
      bordered
      size="small"
      className="c-token-info mb-3"
      column={1}
      labelStyle={{ width: '30%' }}
    >
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
