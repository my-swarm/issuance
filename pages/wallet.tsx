import React, { ReactElement } from 'react';

import { DefaultLayout, Wallet } from '@components';
import { Contributions } from '../@components/contributions';

export default function WalletPage(): ReactElement {
  return (
    <DefaultLayout title="Wallet">
      <Wallet />
      <h2 className="mt-4">My Contributions</h2>
      <Contributions />
    </DefaultLayout>
  );
}
