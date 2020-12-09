import { useEffect, useState } from 'react';
import { BigNumber, Contract } from 'ethers';
import { formatUnits, getContract, getContractAbi, getContractAddress, SWM_TOKEN_DECIMALS } from '@lib';
import { useEthers, useAppState } from '.';
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
  const { networkId } = useEthers();
  const [{ onlineToken }] = useAppState();
  useEffect(() => {
    if (onlineToken) {
      const result = {};
      for (const c of Object.values(contractsMeta)) {
        const name = c.shortName;
        result[name] = getContractAddress(name, networkId, onlineToken)?.toLowerCase();
      }
      setAddresses(result);
    }
  }, [onlineToken, networkId]);
  return addresses;
}

export function useContract(): ContractMap {
  const [contracts, setContracts] = useState<ContractMap>({});
  const { signer, networkId } = useEthers();
  const [{ onlineToken }] = useAppState();
  useEffect(() => {
    if (onlineToken && signer && networkId) {
      const result = {};
      for (const c of Object.values(contractsMeta)) {
        const name = c.shortName;
        result[name] = getContract(name, signer, networkId, onlineToken);
      }
      setContracts(result);
    }
  }, [onlineToken, signer, networkId]);
  return contracts;
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

export function useErc20Balance(erc20Address): UseContractValueResult {
  const { address, provider } = useEthers();
  const [contract, setContract] = useState<Contract>();
  const [value, setValue] = useState<ContractValue>({ raw: undefined, nice: 'N/A' });
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [decimals, setDecimals] = useState<number>();

  useEffect(() => {
    if (erc20Address) {
      const c = new Contract(erc20Address, getContractAbi('erc20'), provider);
      setContract(c);
      c.decimals().then((x) => setDecimals(x));
    }
  }, [erc20Address]);

  useEffect(() => {
    if (contract && address && decimals) {
      contract.balanceOf(address).then((raw) => {
        setValue({ raw, nice: formatUnits(raw, decimals) });
      });
    }
  }, [contract, address, decimals, timestamp]);

  return [value, () => setTimestamp(Date.now())];
}
