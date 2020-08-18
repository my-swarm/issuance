import React, { ReactElement } from 'react';
import { Token } from '@types';

interface TokenManageFundraiserProps {
  token: Token;
}

export function TokenManageFundraiser({ token }: TokenManageFundraiserProps): ReactElement {
  return (
    <div>
      <div>TokenManageFundraiser {token.symbol}</div>
      <div>my ass</div>
    </div>
  );
}
