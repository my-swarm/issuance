import React, { ReactElement, ReactNode } from 'react';
import { etherscanDomains } from '@const';
import { EthereumNetwork } from '@types';
import { useEthers } from '@app';

interface AddressProps {
  children: ReactNode;
  link?: boolean;
}

export function Address({ children, link = false }: AddressProps): ReactElement | null {
  const { networkId } = useEthers();

  if (typeof children !== 'string') {
    return null;
  }

  if (link && !networkId) {
    throw new Error('Need to provide networkId to display as a link');
  }

  const chunks = children.match(/.{1,4}/g);
  if (!chunks || chunks.length <= 1) {
    return <div className="c-address">children</div>;
  }

  function getEtherscanUrl(networkId, address) {
    return `https://${etherscanDomains[networkId]}/address/${address}`;
  }

  let result = (
    <div className="c-address">
      {chunks.map((part, key) => (
        <span key={key}>{part}</span>
      ))}
    </div>
  );

  if (link) {
    result = (
      <a href={getEtherscanUrl(networkId, children)} target="_blank">
        {result}
      </a>
    );
  }

  return result;
}
