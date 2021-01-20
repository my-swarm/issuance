import React from 'react';
import { Icon } from './Icon';

interface Props {
  token: {
    name: string;
    symbol: string;
  };
}

export function TokenTitle({ token }: Props) {
  const { name, symbol } = token;

  return (
    <span>
      <Icon name={symbol.toLowerCase()} /> <span>{symbol}</span>
    </span>
  );
}
