import React from 'react';

import { DefaultLayout, FundraiserIssuerCard, Loading } from '@components';
import { useEthers } from '@app';
import { useFundraisersQuery } from '@graphql';

export default function Fundraisers() {
  const { address } = useEthers();
  const { data, loading } = useFundraisersQuery({ variables: { owner: address } });
  if (loading) return <Loading />;
  const fundraisers = data?.fundraisers || [];

  return (
    <DefaultLayout title="My fundraisers">
      {fundraisers.length > 0 ? (
        fundraisers.map((fundraiser) => (
          <div className="mb-3" key={fundraiser.id}>
            <FundraiserIssuerCard fundraiser={fundraiser} />
          </div>
        ))
      ) : (
        <p>To create your first fundraiser, deploy a token first and then deploy a fundraiser on it.</p>
      )}
    </DefaultLayout>
  );
}
