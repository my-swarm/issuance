import React, { ReactElement, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Block, JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { Signer } from '@ethersproject/abstract-signer';
import { Wallet } from '@ethersproject/wallet';
import { devEthereumAccounts, devEthereumNode, isDev } from './config';
import { EthereumNetwork, getNetwork, Metamask } from '@lib';

export enum EthersStatus {
  DISCONNECTED,
  CONNECTED,
  FAILED,
}

interface ContextProps {
  status: EthersStatus;
  provider?: Web3Provider | JsonRpcProvider;
  signer?: Signer;
  address?: string;
  networkId: EthereumNetwork;
  network: string;
  connect: (silent: boolean) => void;
  connected: boolean;
  disconnect: () => void;
  contract: (name: string) => Contract;
  block: Block;
}

export const EthersContext = React.createContext<Partial<ContextProps>>({});

interface EthersProviderProps {
  devAccountId: number;
  children: ReactNode;
}

export function EthersProvider({ children, devAccountId }: EthersProviderProps): ReactElement {
  const [provider, setProvider] = useState<Web3Provider | JsonRpcProvider>(undefined);
  const [signer, setSigner] = useState<Signer>();
  const [networkId, setNetworkId] = useState<EthereumNetwork>();
  const [status, setStatus] = useState<EthersStatus>(EthersStatus.DISCONNECTED);
  const [address, setAddress] = useState<string>();
  const [metamask, setMetamask] = useState<Metamask>();
  const [block, setBlock] = useState<Block>();

  useEffect(() => {
    if (isDev && devAccountId !== undefined) {
      resetJsonRpcProvider();
    } else if (process.browser && window['ethereum']) {
      const m = new Metamask(window['ethereum']);
      setMetamask(m);
    } else {
      return null;
    }
  }, [devAccountId]);

  const connect = useCallback(
    async (silent: boolean): Promise<void> => {
      if (!metamask) return;
      metamask.onStateUpdate((e) => {
        resetWeb3Provider(e);
      });
      await metamask.initAndConnect(silent);
    },
    [metamask],
  );

  useEffect(() => {
    if (metamask) {
      connect(true).then();
    }
  }, [metamask, connect]);

  useEffect(() => {
    if (provider) provider.getBlock('latest').then(setBlock);
  }, [provider]);

  async function resetWeb3Provider(ethereum = undefined) {
    if (!ethereum) {
      setStatus(EthersStatus.FAILED);
      return;
    }
    const _provider = new Web3Provider(ethereum);
    const _signer = _provider && _provider.getSigner();

    setProvider(_provider);
    setSigner(_signer);
    if (!_provider) {
      setStatus(EthersStatus.FAILED);
      return;
    }

    const _networkId = (await _signer.getChainId()) as EthereumNetwork;
    setNetworkId(_networkId);
    const accounts = await _provider.listAccounts();
    if (accounts && accounts.length > 0) {
      setAddress(accounts[0].toLowerCase());
      setStatus(EthersStatus.CONNECTED);
    } else {
      setAddress(undefined);
      setStatus(EthersStatus.DISCONNECTED);
    }
  }

  async function resetJsonRpcProvider() {
    const url = `${devEthereumNode.address}`;
    const devAccount = devEthereumAccounts[devAccountId];
    const _provider = new JsonRpcProvider(url, devEthereumNode.networkId);
    if (!_provider) {
      setStatus(EthersStatus.FAILED);
      return;
    }

    const _signer = _provider && new Wallet(devAccount.privateKey, _provider);
    setProvider(_provider);
    setSigner(_signer);
    setNetworkId(devEthereumNode.networkId);
    setAddress(devAccount.address);
    setStatus(EthersStatus.CONNECTED);
  }

  return (
    <EthersContext.Provider
      value={{
        provider,
        signer,
        status,
        connected: status === EthersStatus.CONNECTED,
        address,
        networkId,
        network: getNetwork(networkId),
        connect,
        block,
      }}
    >
      {children}
    </EthersContext.Provider>
  );
}

export const useEthers = () => useContext(EthersContext);
