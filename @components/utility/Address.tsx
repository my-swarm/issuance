import React, { ReactElement, ReactNode } from 'react';
import { etherscanDomains } from '@const';
import { EthereumNetwork } from '@types';
import { useEthers } from '@app';

interface AddressProps {
  children: ReactNode;
  link?: boolean;
  short?: boolean;
}

function getEtherscanUrl(networkId, address) {
  return `https://${etherscanDomains[networkId]}/address/${address}`;
}

export function Address({ children, link = false, short = false }: AddressProps): ReactElement | null | undefined {
  console.log('address', children);
  const { networkId } = useEthers();

  if (typeof children !== 'string') {
    return <>{children}</>;
  }

  if (link && !networkId) {
    throw new Error('Need to provide networkId to display as a link');
  }

  let result;

  if (short) {
    result = (
      <div className="c-address" title={children}>
        <span>{children.substr(0, 8)}</span>
        <span>…</span>
        <span>{children.substr(-6)}</span>
      </div>
    );
  } else {
    const chunks = children.match(/.{1,8}/g);
    result = (
      <div className="c-address">
        {chunks.map((part, key) => (
          <span key={key}>{part}</span>
        ))}
      </div>
    );
  }

  if (link) {
    result = (
      <a href={getEtherscanUrl(networkId, children)} target="_blank" rel="noopener noreferrer">
        {result}
      </a>
    );
  }

  return result;
}
