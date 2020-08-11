import React, { ReactElement } from 'react';
import { Token } from '../../@types';

interface TokenManageProps {
  token: Token;
}

export function TokenManage({ token }: TokenManageProps): ReactElement {
  return (
    <div>
      <div>TokenManage {token.symbol}</div>
      <div>my ass</div>
    </div>
  );
}
