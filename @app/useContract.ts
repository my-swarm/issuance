import { useCallback, useEffect, useState } from 'react';
import { BigNumber, Contract } from 'ethers';
import { formatNumber, formatUnits, getContract, getContractAddress } from '@lib';
import { useEthers, useAppState } from '.';
import { SWM_TOKEN_DECIMALS } from '@const';
import { Token } from '@types';
import { contractsMeta } from '@contracts';

enum ContractValueType {
  Integer,
  Decimal,
  TokenAmount,
  SwmTokenAmount,
}

const contractValues = {
  nav: {
    name: 'assetRegistry',
    method: 'getNetAssetValueUSD',
    type: ContractValueType.Integer,
    implicitArgs: { 0: 'address.src20' },
  },
  currentSupply: { name: 'src20', method: 'totalSupply', type: ContractValueType.TokenAmount },
  maxSupply: { name: 'src20', method: '_maxTotalSupply', type: ContractValueType.TokenAmount },
  availableSupply: {
    name: 'src20',
    method: 'balanceOf',
    type: ContractValueType.TokenAmount,
    implicitArgs: {
      0: 'address.ethers',
    },
  },
  swmAllowance: {
    name: 'swm',
    method: 'allowance',
    type: ContractValueType.SwmTokenAmount,
    implicitArgs: {
      0: 'address.ethers',
      1: 'address.registry',
    },
  },
  swmStake: {
    name: 'registry',
    method: 'getStake',
    type: ContractValueType.SwmTokenAmount,
    implicitArgs: { 0: 'address.src20' },
  },
  computeStake: { name: 'registry', method: 'computeStake', type: ContractValueType.SwmTokenAmount },
};

type ContractAddressMap = { [key: string]: string };
type ContractMap = { [key: string]: Contract };

export function useContractAddress(): ContractAddressMap {
  const [addresses, setAddresses] = useState<ContractAddressMap>({});
  const { signer, networkId } = useEthers();
  const [{ token }] = useAppState();
  useEffect(() => {
    if (token && networkId) {
      const result = {};
      for (const c of Object.values(contractsMeta)) {
        const name = c.shortName;
        result[name] = getContractAddress(name, networkId, token)?.toLowerCase();
      }
      setAddresses(result);
    }
  }, [token, networkId]);
  return addresses;
}

export function useContract(): ContractMap {
  const [contracts, setContracts] = useState<ContractMap>({});
  const { signer, networkId } = useEthers();
  const [{ token }] = useAppState();
  useEffect(() => {
    if (token && signer && networkId) {
      const result = {};
      for (const c of Object.values(contractsMeta)) {
        const name = c.shortName;
        result[name] = getContract(name, signer, networkId, token);
      }
      setContracts(result);
    }
  }, [token, signer, networkId]);
  return contracts;
}

function useContractHelpers() {
  const [{ token }] = useAppState();
  const { address } = useEthers();
  /*
  const handleUpdate = useCallback(() => {
    setTimestamp(Date.now());
  }, []);
*/
  return { token, address };
}

interface ContractValue {
  raw?: BigNumber | number | string | boolean;
  nice?: string;
}

type UseContractValueResult = [ContractValue | undefined, () => void];

export function useSwmAllowance(): UseContractValueResult {
  const { address } = useEthers();
  const { swm } = useContract();
  const { src20: src20Address } = useContractAddress();
  const [value, setValue] = useState<ContractValue>({});
  const [timestamp, setTimestamp] = useState<number>(Date.now());

  useEffect(() => {
    if (swm && address && src20Address) {
      swm.allowance(address, src20Address).then((raw) => {
        setValue({ raw, nice: formatUnits(raw, SWM_TOKEN_DECIMALS) });
      });
    }
  }, [swm, address, src20Address, timestamp]);

  return [value, () => setTimestamp(Date.now())];
}

export function useSwmBalance(): UseContractValueResult {
  const { address } = useEthers();
  const { swm } = useContract();
  const [value, setValue] = useState<ContractValue>({});
  const [timestamp, setTimestamp] = useState<number>(Date.now());

  useEffect(() => {
    if (swm && address) {
      swm.balanceOf(address).then((raw) => {
        setValue({ raw, nice: formatUnits(raw, SWM_TOKEN_DECIMALS) });
      });
    }
  }, [swm, address, timestamp]);

  return [value, () => setTimestamp(Date.now())];
}
