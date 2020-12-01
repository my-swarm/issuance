import React, { ReactElement } from 'react';
import { FundraiserInfoCommon, FundraiserProgressChart, Loading } from '@components';
import { useFundraiserWithContributorsQuery } from '@graphql';
import { FundraiserInfoBaseCurrency } from '../fundraiser/FundraiserInfoBaseCurrency';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface InvestTokenDetailsProps {
  id: string;
}

export function InvestFundraiserDetails({ id }: InvestTokenDetailsProps): ReactElement {
  const { data, loading } = useFundraiserWithContributorsQuery({ variables: { id } });
  if (loading) return <Loading />;
  const { fundraiser } = data;

  return (
    <div>
      <FundraiserInfoCommon fundraiser={fundraiser} column={2} />
      <div className="mb-3" />
      <FundraiserInfoBaseCurrency fundraiser={fundraiser} />
      <div className="mb-3" />
      <h3>
        <strong>Fundraise progress</strong>
      </h3>
      <FundraiserProgressChart fundraiser={fundraiser} />
    </div>
  );
}
