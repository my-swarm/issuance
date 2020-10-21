import React, { useEffect, useState } from 'react';
import { Descriptions } from 'antd';
import { formatNumber, formatUnits } from '@lib';
import { SWM_TOKEN_DECIMALS } from '@const';
import { useAppState, useContract, useEthers } from '@app';

export function TokenInfoStaking() {
  const { address } = useEthers();
  const [{ token }] = useAppState();

  const [stake, setStake] = useState<string>('calculating...');
  const [swmBalance, setSwmBalance] = useState<string>('calculating...');
  const [swmPrice, setSwmPrice] = useState<string>('calculating...');
  const { minter, swmPriceOracle, swmToken } = useContract();

  useEffect(() => {
    minter.calcStake(token.assetNetValue).then((val) => setStake(formatUnits(val, SWM_TOKEN_DECIMALS)));
    swmPriceOracle.getPrice().then(({ priceNumerator, priceDenominator }) => {
      setSwmPrice(formatNumber(priceNumerator.toNumber() / priceDenominator.toNumber(), 4));
    });
    swmToken.balanceOf(address).then((val) => setSwmBalance(formatUnits(val, SWM_TOKEN_DECIMALS)));
  }, [token, minter, swmPriceOracle, swmToken, address]);

  return (
    <Descriptions title="Staking information" layout="vertical" size="small" className="mb-3">
      <Descriptions.Item label="Net Asset Value">{formatNumber(token.assetNetValue)} USD</Descriptions.Item>
      <Descriptions.Item label="Current SWM Price">1 SWM = {swmPrice} USD</Descriptions.Item>
      <Descriptions.Item label="Amount of SWM to stake">
        <strong>{stake} SWM</strong>
      </Descriptions.Item>
      <Descriptions.Item label="Your SWM balance">
        <strong>{swmBalance} SWM</strong>
      </Descriptions.Item>
    </Descriptions>
  );
}
