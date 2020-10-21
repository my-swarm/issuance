import { useCallback, useEffect, useState } from 'react';
import { BigNumber, Contract } from 'ethers';
import { formatNumber, formatTokenAmount, getContract, getContractAddress } from '@lib';
import { useEthers, useAppState } from '.';
import { SWM_TOKEN_DECIMALS } from '@const';
import { Token } from '@types';
import { contractsMeta } from '@contracts';
import { formatUnits } from 'ethers/lib/utils';

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
    name: 'swmToken',
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
  swmNeeded: { name: 'registry', method: 'swmNeeded', type: ContractValueType.SwmTokenAmount },
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
      console.log({ result });
      setContracts(result);
    }
  }, [token, signer, networkId]);
  return contracts;
}
/*
function getContractValueDefinition(key: string) {
  const definition = contractValues[key];
  if (!definition) {
    throw new Error(`Contract value definition not found for ${key}`);
  }
  return definition;
}

interface MergeArgsOptions {
  address: string;
  contracts: ContractMap;
}

function getImplicitValue(template: string, options: MergeArgsOptions) {
  const [type, source] = template.split('.');
  if (!type || !source) throw new Error(`Could not split ${template}`);
  if (type === 'address') {
    if (source === 'ethers') {
      return options.address;
    } else if (options.contracts[source]) {
      return options.contracts[source].address;
    } else {
      throw new Error(`Could not find implicit value for ${template}`);
    }
  }
}

function mergeArgs(implicit: string[] = [], explicit: any[] = [], options: MergeArgsOptions): any[] {
  let currentKey = 0;
  const result = [];
  for (const [implicitKey, implicitValueTemplate] of Object.entries(implicit)) {
    while (parseInt(implicitKey) > currentKey) {
      result.push(explicit.shift());
      currentKey++;
    }

    result.push(getImplicitValue(implicitValueTemplate, options));
    currentKey++;
  }
  return result;
}

function processValue(value: ContractValue, type: ContractValueType, token: Token) {
  switch (type) {
    case ContractValueType.Integer:
      return formatNumber(value as number);
    case ContractValueType.TokenAmount:
      return formatTokenAmount(value as BigNumber, token.decimals);
    case ContractValueType.SwmTokenAmount:
      return formatTokenAmount(value as BigNumber, SWM_TOKEN_DECIMALS);
    default:
      return '??';
  }
}

export function useContractValue(key: string, explicitArgs: any[] = []): [string, ContractValue, () => void] {
  const [rawValue, setRawValue] = useState<string>();
  const [values, setValues] = useState<Array<{ raw: string; value: string }>>([]);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [{ token }] = useAppState();
  const contracts = useContract();
  const { address } = useEthers();

  useEffect(() => {
    if (token && address && contracts) {
      console.log('use effect', key);
      const { name, method, type, implicitArgs } = getContractValueDefinition(key);
      const args = mergeArgs(implicitArgs, explicitArgs, { address, contracts });
      contracts[name][method](...args)
        .then((rawValue) => {
          const processedValue = processValue(rawValue, type, token);
          setRawValue(rawValue);
          setValue(processedValue);
        })
        .catch((e) => {
          if (e.code === 'MISSING_ARGUMENT') {
            throw new Error(`Missing argument for ${key} [${name}.${method}] call`);
          }
          setValue('err');
        });
    }
  }, [contracts, address, key, token]);

  const updateValue = useCallback(() => {
    setTimestamp(Date.now());
  }, []);

  return [value, rawValue, updateValue];
}
*/
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
