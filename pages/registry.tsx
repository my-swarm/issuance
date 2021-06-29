import React, { ReactElement } from 'react';

import { DefaultLayout, TokenListPublic } from '@components';

export default function WalletPage(): ReactElement {
  return (
    <DefaultLayout title="Token Registry">
      <TokenListPublic />
    </DefaultLayout>
  );
}
