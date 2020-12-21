import React from 'react';
import Link from 'next/link';
import { Button, Space } from 'antd';

import { DefaultLayout, FundraiserIssuerCard, Loading } from '@components';
import { useAppState, useEthers } from '@app';
import { useFundraisersQuery } from '@graphql';

export default function Fundraisers() {
  const [{ tokens }, dispatch] = useAppState();
  const { address } = useEthers();
  const { data, loading, error } = useFundraisersQuery({ variables: { owner: address } });
  if (loading) return <Loading />;
  const fundraisers = data?.fundraisers || [];

  const renderHeadExtra = () => (
    <Space>
      <Button type="primary">Start new Fundraiser</Button>
      <Link href="/tokens">
        <Button>Manage my Tokens</Button>
      </Link>
    </Space>
  );
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
