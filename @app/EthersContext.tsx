import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { ethers, Signer } from 'ethers';
import { Metamask } from '@lib';
import { EthereumNetwork } from '@types';

export enum EthersStatus {
  DISCONNECTED,
  CONNECTED,
  FAILED,
}

interface ContextProps {
  status: EthersStatus;
  provider: Web3Provider | undefined;
  signer: Signer | undefined;
  address: string | undefined;
  networkId: EthereumNetwork;
  connect: (silent: boolean) => void;
  disconnect: () => void;
}

export const EthersContext = React.createContext<Partial<ContextProps>>({});

export function EthersProvider({ children }: { children: ReactNode }): ReactElement {
  const [provider, setProvider] = useState<Web3Provider | undefined>(undefined);
  const [signer, setSigner] = useState<Signer>();
  const [networkId, setNetworkId] = useState<EthereumNetwork>();
  const [status, setStatus] = useState<EthersStatus>(EthersStatus.DISCONNECTED);
  const [address, setAddress] = useState<string>();

  useEffect(() => {
    connect(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateAddress = async () => {
      if (provider) {
        const accounts = await provider.listAccounts();
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
        }
      }
    };
  });

  let metamask: Metamask;
  if (process.browser && window['ethereum']) {
    metamask = new Metamask(window['ethereum']);
  }

  async function resetProvider(ethereum) {
    if (!ethereum) {
      setStatus(EthersStatus.FAILED);
      return;
    }

    const _provider = new ethers.providers.Web3Provider(ethereum);
    setProvider(_provider);
    if (!_provider) return;

    const _signer = _provider.getSigner();
    setSigner(_signer);
    const _networkId = (await _signer.getChainId()) as EthereumNetwork;
    setNetworkId(_networkId);
    const accounts = await _provider.listAccounts();
    if (accounts && accounts.length > 0) {
      setAddress(accounts[0]);
      setStatus(EthersStatus.CONNECTED);
    }
  }

  async function connect(silent: boolean): Promise<void> {
    if (!metamask) return;
    metamask.onStateUpdate(resetProvider);
    await metamask.initAndConnect(silent);
  }

  async function disconnect() {
    if (!metamask) {
      return;
    }
    await metamask.disconnect();
    setProvider(undefined);
    setSigner(undefined);
    setAddress(undefined);
  }

  return (
    <EthersContext.Provider
      value={{
        provider,
        signer,
        status,
        address,
        networkId,
        connect,
        disconnect,
      }}
    >
      {children}
    </EthersContext.Provider>
  );
}
