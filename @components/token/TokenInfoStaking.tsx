import React, { useEffect, useState } from 'react';
import { Token } from '@types';
import { Descriptions } from 'antd';
import { formatNumber, getTokenAmount } from '@lib';
import { SWM_TOKEN_DECIMALS } from '@const';
import { useContract } from '@app';

export function TokenInfoStaking({ token }: { token: Token }) {
  const [stake, setStake] = useState<string>('calculating...');
  const [swmPrice, setSwmPrice] = useState<string>('calculating...');
  const getRateMinter = useContract('getRateMinter');
  const swmPriceOracle = useContract('priceOracle');

  useEffect(() => {
    getRateMinter
      .calcStake(token.assetNetValue)
      .then((val) => setStake(formatNumber(getTokenAmount(val, SWM_TOKEN_DECIMALS))));
    swmPriceOracle.getPrice().then(({ priceNumerator, priceDenominator }) => {
      setSwmPrice(formatNumber(priceNumerator.toNumber() / priceDenominator.toNumber(), 4));
    });
  }, [token, getRateMinter]);

  return (
    <Descriptions title="Staking information" layout="vertical" size="small" className="mb-3">
      <Descriptions.Item label="Net Asset Value">{formatNumber(token.assetNetValue)} USD</Descriptions.Item>
      <Descriptions.Item label="Current SWM Price">1 SWM = {swmPrice} USD</Descriptions.Item>
      <Descriptions.Item label="Amount of SWM to stake">
        <strong>{stake} SWM</strong>
      </Descriptions.Item>
    </Descriptions>
  );
}
