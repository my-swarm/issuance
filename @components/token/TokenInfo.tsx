import React, { ReactElement } from 'react';
import { Token } from '@types';
import { TokenInfoAsset, TokenInfoBasics, TokenInfoDeployed } from '..';

interface TokenManageProps {
  token: Token;
}

export function TokenInfo({ token }: TokenManageProps): ReactElement {
  return (
    <div>
      <TokenInfoBasics token={token} />
      <TokenInfoDeployed token={token} />
      <TokenInfoAsset token={token} />
    </div>
  );
}
