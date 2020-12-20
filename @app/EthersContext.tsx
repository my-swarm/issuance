import React, { ReactElement, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { getNetwork, Network, Web3Provider, JsonRpcProvider } from '@ethersproject/providers';
import { Contract, ethers, Signer, Wallet } from 'ethers';
import { devEthereumAccounts, devEthereumNode } from './config';
import { Metamask, EthereumNetwork } from '@lib';

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
  network: Network;
  connect: (silent: boolean) => void;
  connected: boolean;
  disconnect: () => void;
  contract: (name: string) => Contract;
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

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEV === '1' && devAccountId !== undefined) {
      resetJsonRpcProvider();
    } else if (process.browser && window['ethereum']) {
      const m = new Metamask(window['ethereum']);
      setMetamask(m);
    } else {
      throw new Error('Could not figure out how to setup ethereum provider');
    }
  }, [devAccountId]);

  const connect = useCallback(
    async (silent: boolean): Promise<void> => {
      if (!metamask) return;
      metamask.onStateUpdate((e) => {
        console.log('metemask state update', e);
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

  async function resetWeb3Provider(ethereum = undefined) {
    if (!ethereum) {
      setStatus(EthersStatus.FAILED);
      return;
    }
    const _provider = new ethers.providers.Web3Provider(ethereum);
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
    const _provider = new ethers.providers.JsonRpcProvider(url, devEthereumNode.networkId);
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
      }}
    >
      {children}
    </EthersContext.Provider>
  );
}

export const useEthers = () => useContext(EthersContext);
