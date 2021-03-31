import { ContractValue, useContract, useSwmBalance } from './useContract';
import { useEffect, useMemo, useState } from 'react';
import { formatNumber, OnlineToken } from '@lib';
import { BigNumber } from '@ethersproject/bignumber';
import { useEthers } from './EthersContext';
import { useAppState } from './StateContext';

interface Return {
  swmBalance: ContractValue;
  reloadSwmBalance: () => void;
  fee: BigNumber;
  swmPrice: string;
  lowSwmBalance: boolean | undefined;
}

export function useFeeInfo(value?: number): Return {
  const { address } = useEthers();
  const [{ onlineToken: token }] = useAppState();
  const [swmBalance, reloadSwmBalance] = useSwmBalance();
  const [fee, setFee] = useState<BigNumber>();
  const [swmPrice, setSwmPrice] = useState<string>();
  const { minter, swmPriceOracle, swm } = useContract();

  useEffect(() => {
    if (minter && swmPriceOracle && swm) {
      minter.calcFee(value || token.nav).then((val) => setFee(val));
      swmPriceOracle.getPrice().then(({ numerator, denominator }) => {
        setSwmPrice(formatNumber(numerator.toNumber() / denominator.toNumber(), 4));
      });
    }
  }, [token, minter, swmPriceOracle, swm, address]);

  const lowSwmBalance = useMemo(() => {
    if (swmBalance.raw && fee) {
      return BigNumber.from(swmBalance.raw).lt(fee);
    } else {
      return undefined;
    }
  }, [swmBalance, fee]);

  return {
    swmBalance,
    reloadSwmBalance,
    fee,
    swmPrice,
    lowSwmBalance,
  };
}
