import { useEffect, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import {
  EthereumNetwork,
  formatUnits,
  getContract,
  getContractAbi,
  getContractAddress,
  getUnitsAsNumber,
  SWM_TOKEN_DECIMALS,
} from '@lib';
import { useEthers, useAppState, devSwmBalances } from '.';
import { contractsMeta } from '@contracts';

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
    if (signer && networkId) {
      const result = {};
      for (const c of Object.values(contractsMeta)) {
        if (c.isBase || onlineToken) {
          const name = c.shortName;
          result[name] = getContract(name, signer, networkId, onlineToken);
        }
      }
      setContracts(result);
    }
  }, [onlineToken, signer, networkId]);
  return contracts;
}

export interface ContractValue {
  raw?: BigNumber | number | string | boolean;
  nice?: string;
  number?: number;
}

type UseContractValueResult = [ContractValue | undefined, () => void];

export function useSwmAllowance(): UseContractValueResult {
  const { address } = useEthers();
  const { swm } = useContract();
  const { minter } = useContract();
  const [value, setValue] = useState<ContractValue>({});
  const [timestamp, setTimestamp] = useState<number>(Date.now());

  useEffect(() => {
    if (swm && address && minter) {
      swm.allowance(address, minter.address).then((raw) => {
        setValue({ raw, nice: formatUnits(raw, SWM_TOKEN_DECIMALS) });
      });
    }
  }, [swm, address, minter, timestamp]);

  return [value, () => setTimestamp(Date.now())];
}

export function useSwmBalance(account?: string): UseContractValueResult {
  const { address, networkId } = useEthers();
  const { swm } = useContract();
  const [value, setValue] = useState<ContractValue>({});
  const [timestamp, setTimestamp] = useState<number>(Date.now());

  if (!account) account = address;

  useEffect(() => {
    if (swm && account) {
      if (networkId !== EthereumNetwork.Main && devSwmBalances[account]) {
        setValue({
          raw: devSwmBalances[account],
          nice: devSwmBalances[account].toString(),
          number: devSwmBalances[account],
        });
      } else {
        swm.balanceOf(account).then((raw) => {
          setValue({
            raw,
            nice: formatUnits(raw, SWM_TOKEN_DECIMALS),
            number: getUnitsAsNumber(raw, SWM_TOKEN_DECIMALS),
          });
        });
      }
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
        setValue({ raw, nice: formatUnits(raw, decimals), number: getUnitsAsNumber(raw, decimals) });
      });
    }
  }, [contract, address, decimals, timestamp]);

  return [value, () => setTimestamp(Date.now())];
}
