import React, { ReactElement } from 'react';
import { Token } from '@types';
import { TokenInfoGeneral, FundraiserForm } from '..';

interface TokenManageProps {
  token: Token;
  onCancel: () => void;
}

export function TokenStartFundraiser({ token, onCancel }: TokenManageProps): ReactElement {
  return (
    <div>
      <TokenInfoGeneral token={token} />
      <FundraiserForm onCancel={onCancel} onSubmit={() => console.log('submit')} />
    </div>
  );
}
