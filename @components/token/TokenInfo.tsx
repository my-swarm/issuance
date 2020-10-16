import React, { ReactElement } from 'react';
import { TokenInfoAsset, TokenInfoBasics, TokenInfoDeployed } from '..';

export function TokenInfo(): ReactElement {
  return (
    <div>
      <TokenInfoBasics />
      <TokenInfoDeployed />
      <TokenInfoAsset />
    </div>
  );
}
