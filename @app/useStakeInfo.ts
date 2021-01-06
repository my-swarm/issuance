import { ContractValue, useContract, useSwmBalance } from './useContract';
import { useEffect, useMemo, useState } from 'react';
import { formatNumber, OnlineToken } from '@lib';
import { BigNumber } from 'ethers';
import { useEthers } from './EthersContext';
import { useAppState } from './StateContext';

interface Return {
  swmBalance: ContractValue;
  reloadSwmBalance: () => void;
  stake: BigNumber;
  swmPrice: string;
  lowSwmBalance: boolean | undefined;
}

export function useStakeInfo(value?: number): Return {
  const { address } = useEthers();
  const [{ onlineToken: token }] = useAppState();
  const [swmBalance, reloadSwmBalance] = useSwmBalance();
  const [stake, setStake] = useState<BigNumber>();
  const [swmPrice, setSwmPrice] = useState<string>();
  const { minter, swmPriceOracle, swm } = useContract();

  useEffect(() => {
    if (minter && swmPriceOracle && swm) {
      minter.calcStake(value || token.nav).then((val) => setStake(val));
      swmPriceOracle.getPrice().then(({ numerator, denominator }) => {
        setSwmPrice(formatNumber(numerator.toNumber() / denominator.toNumber(), 4));
      });
    }
  }, [token, minter, swmPriceOracle, swm, address]);

  const lowSwmBalance = useMemo(() => {
    if (swmBalance.raw && stake) {
      return BigNumber.from(swmBalance.raw).lt(stake);
    } else {
      return undefined;
    }
  }, [swmBalance, stake]);

  return {
    swmBalance,
    reloadSwmBalance,
    stake,
    swmPrice,
    lowSwmBalance,
  };
}
