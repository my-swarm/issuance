import React, { ReactElement } from 'react';
import { useFundraiserWithContributorsQuery } from '@graphql';
import { FundraiserInfo, Loading } from '..';

interface InvestTokenDetailsProps {
  id: string;
}

export function InvestFundraiserDetails({ id }: InvestTokenDetailsProps): ReactElement {
  const { data, loading } = useFundraiserWithContributorsQuery({ variables: { id } });
  if (loading) return <Loading />;
  const { fundraiser } = data;

  return <FundraiserInfo fundraiser={fundraiser} />;
}
