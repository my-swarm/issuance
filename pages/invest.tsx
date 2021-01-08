import React, { ReactElement, useState } from 'react';
import { DefaultLayout, InvestFilter, InvestFilterFields } from '@components';
import { InvestFundraisers } from '../@components/invest/InvestFundraisers';

export default function InvestPage(): ReactElement {
  const [filter, setFilter] = useState<InvestFilterFields>({ search: '' });

  console.log({ filter });
  return (
    <DefaultLayout title="Invest" headExtra={<InvestFilter onSearch={(values) => setFilter(values)} />}>
      <InvestFundraisers search={filter.search} />
    </DefaultLayout>
  );
}
