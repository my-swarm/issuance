import React, { ReactElement } from 'react';
import { Token } from '../../@types';

interface TokenStakeAndMintProps {
  token: Token;
}

export function TokenStakeAndMint({ token }: TokenStakeAndMintProps): ReactElement {
  return (
    <div>
      <div>TokenStakeAndMint {token.symbol}</div>
      <div>my ass</div>
    </div>
  );
}
