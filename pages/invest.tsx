import React, { ReactElement } from 'react';
import { DefaultLayout } from '@components';
import { InvestFundraisers } from '../@components/invest/InvestFundraisers';

export default function InvestPage(): ReactElement {
  return (
    <DefaultLayout title="Invest">
      <InvestFundraisers />
    </DefaultLayout>
  );
}
