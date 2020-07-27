import React, { ReactNode, useEffect, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { ethers, Signer } from 'ethers';
import { Metamask } from '@lib';

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
  connect: (silent: boolean) => void;
  disconnect: () => void;
}

export const EthersContext = React.createContext<Partial<ContextProps>>({});

export function EthersProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<Web3Provider | undefined>(undefined);
  const [signer, setSigner] = useState<Signer>();
  const [status, setStatus] = useState<EthersStatus>(EthersStatus.DISCONNECTED);
  const [address, setAddress] = useState<string>();

  useEffect(() => {
    connect(true);
  }, []);

  useEffect(() => {
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

  async function connect(silent: boolean) {
    if (!metamask) {
      return;
    }
    const ethereum = await metamask.initAndConnect(silent);
    if (ethereum) {
      const _provider = new ethers.providers.Web3Provider(ethereum);
      setProvider(_provider);
      if (_provider) {
        setSigner(_provider.getSigner());
        const accounts = await _provider.listAccounts();
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setStatus(EthersStatus.CONNECTED);
        }
      }
    } else {
      setStatus(EthersStatus.FAILED);
    }
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
        connect,
        disconnect,
      }}
    >
      {children}
    </EthersContext.Provider>
  );
}
