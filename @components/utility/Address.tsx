import React, { ReactElement, ReactNode, useCallback } from 'react';
import { etherscanDomains } from '@const';
import { EthereumNetwork } from '@types';
import { useEthers } from '@app';
import { CopyOutlined } from '@ant-design/icons';

interface AddressProps {
  children: ReactNode;
  link?: boolean;
  short?: boolean;
}

function getEtherscanUrl(networkId, address) {
  return `https://${etherscanDomains[networkId]}/address/${address}`;
}

export function Address({ children, link = false, short = false }: AddressProps): ReactElement | null | undefined {
  const { networkId } = useEthers();

  const handleCopyToClipboard = useCallback(() => {
    if (typeof children === 'string') {
      navigator.clipboard.writeText(children);
    }
  }, [children]);

  if (typeof children !== 'string') {
    return <>{children}</>;
  }

  if (link && !networkId) {
    throw new Error('Need to provide networkId to display as a link');
  }

  let result;

  if (short) {
    result = (
      <span className="c-address" title={children}>
        <span>{children.substr(0, 8)}</span>
        <span>…</span>
        <span>{children.substr(-6)}</span>
      </span>
    );
  } else {
    const chunks = children.match(/.{1,8}/g);
    result = (
      <span className="c-address">
        {chunks.map((part, key) => (
          <span key={key}>{part}</span>
        ))}
      </span>
    );
  }

  if (link) {
    result = (
      <a href={getEtherscanUrl(networkId, children)} target="_blank" rel="noopener noreferrer">
        {result}
      </a>
    );
  }

  return (
    <>
      {result}&nbsp;
      <CopyOutlined onClick={handleCopyToClipboard} />
    </>
  );
}
