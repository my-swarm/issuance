import React, { ReactElement } from 'react';
import { Empty } from 'antd';
import { DefaultLayout } from '@components';

export default function InvestPage(): ReactElement {
  return (
    <DefaultLayout title="Invest">
      <Empty description="Coming soon!">As an investor, you will be able to list token fundraisers and invest.</Empty>
    </DefaultLayout>
  );
}
