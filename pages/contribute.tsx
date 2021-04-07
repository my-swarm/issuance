import React, { ReactElement, useState } from 'react';
import { DefaultLayout, InvestFilter, InvestFilterFields } from '@components';
import { InvestFundraisers } from '../@components/invest/InvestFundraisers';

export default function InvestPage(): ReactElement {
  const [filter, setFilter] = useState<InvestFilterFields>({ search: '' });

  return (
    <DefaultLayout title="Contribute" headExtra={<InvestFilter onSearch={(values) => setFilter(values)} />}>
      <InvestFundraisers search={filter.search} />
    </DefaultLayout>
  );
}
