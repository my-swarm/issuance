import React, { ReactElement } from 'react';
import { Token } from '../../@types';

interface TokenManageFundraiseProps {
  token: Token;
}

export function TokenManageFundraise({ token }: TokenManageFundraiseProps): ReactElement {
  return (
    <div>
      <div>TokenManageFundraise {token.symbol}</div>
      <div>my ass</div>
    </div>
  );
}
