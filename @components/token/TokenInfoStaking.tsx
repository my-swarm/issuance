import React, { useEffect, useState } from 'react';
import { Descriptions } from 'antd';

import { formatNumber, formatUnits, SWM_TOKEN_DECIMALS } from '@lib';
import { useAppState, useContract, useEthers, useSwmBalance } from '@app';

export function TokenInfoStaking() {
  const { address } = useEthers();
  const [{ onlineToken: token }] = useAppState();

  const [stake, setStake] = useState<string>('calculating...');
  const [swmBalance] = useSwmBalance();
  const [swmPrice, setSwmPrice] = useState<string>('calculating...');
  const { minter, swmPriceOracle, swm } = useContract();

  useEffect(() => {
    if (minter && swmPriceOracle && swm) {
      minter.calcStake(token.nav).then((val) => setStake(formatUnits(val, SWM_TOKEN_DECIMALS)));
      swmPriceOracle.getPrice().then(({ numerator, denominator }) => {
        setSwmPrice(formatNumber(numerator.toNumber() / denominator.toNumber(), 4));
      });
    }
  }, [token, minter, swmPriceOracle, swm, address]);

  return (
    <Descriptions title="Staking information" layout="vertical" size="small" className="mb-3" bordered column={4}>
      <Descriptions.Item label="Net Asset Value">{formatNumber(token.nav)} USD</Descriptions.Item>
      <Descriptions.Item label="Current SWM Price">1 SWM = {swmPrice} USD</Descriptions.Item>
      <Descriptions.Item label="Amount of SWM to stake">
        <strong>{stake} SWM</strong>
      </Descriptions.Item>
      <Descriptions.Item label="Your SWM balance">
        <strong>{swmBalance.nice} SWM</strong>
      </Descriptions.Item>
    </Descriptions>
  );
}
