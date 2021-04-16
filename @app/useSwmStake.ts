import { useState, useEffect } from 'react';
import { useContract } from './useContract';
import { useEthers } from './EthersContext';
import { EthereumNetwork, getUnitsAsNumber, parseUnits, SWM_TOKEN_DECIMALS } from '@lib';

interface ReturnType {
  swmStake: number;
  swmRewards: number;
  swmLockedUni: number;
}

export function useSwmStake(): ReturnType {
  const [swmStake, setSwmStake] = useState<number>();
  const [swmRewards, setSwmRewards] = useState<number>();
  const [swmLockedUni, setSwmLockedUni] = useState<number>();
  const { connected, networkId } = useEthers();
  const { stake, uniPair } = useContract();

  useEffect(() => {
    if (networkId !== EthereumNetwork.Main) {
      setSwmStake(11971231);
      setSwmRewards(117000);
      setSwmLockedUni(2290308);
    } else if (connected && stake && uniPair) {
      stake.poolInfo(0).then((info) => {
        setSwmStake(getUnitsAsNumber(info.totalStaked, SWM_TOKEN_DECIMALS));
      });
      stake.totalRewards().then((rewards) => {
        setSwmRewards(getUnitsAsNumber(rewards, SWM_TOKEN_DECIMALS));
      });
      uniPair.getReserves().then(([reserveSwm]) => {
        setSwmLockedUni(getUnitsAsNumber(reserveSwm, SWM_TOKEN_DECIMALS));
      });
    }
  }, [connected, networkId, stake, uniPair]);

  return { swmStake, swmRewards, swmLockedUni };
}
