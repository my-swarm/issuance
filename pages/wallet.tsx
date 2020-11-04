import React, { ReactElement } from 'react';
import { Empty } from 'antd';
import { DefaultLayout } from '@components';

export default function WalletPage(): ReactElement {
  return (
    <DefaultLayout title="Wallet">
      <Empty description="Coming soon!">
        As an investor, you will be able to see balances of your tokens, transfer them and more.
      </Empty>
    </DefaultLayout>
  );
}
