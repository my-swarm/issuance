import { FundraiserInvestorCard, Loading } from '@components';
import React, { useEffect, useState } from 'react';
import { useFundraiserWidgetLazyQuery } from '@graphql';
import { useRouter } from 'next/router';
import { Alert } from 'antd';

export default function FundraiserWidget() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [loadQuery, { data, loading }] = useFundraiserWidgetLazyQuery();
  useEffect(() => {
    if (typeof router?.query?.address === 'string') {
      loadQuery({ variables: { id: router.query.address } });
      setError(undefined);
    } else {
      setError('Provide a fundraiser address as a query parameter');
    }
  }, [router]);

  useEffect(() => {
    if (data && !data.fundraiser) {
      setError(`Fundraiser not found by address: ${router.query.address}`);
    }
  }, [data]);

  return (
    <div className="widget-fundraiser">
      {error ? (
        <Alert message={error} type="error" showIcon />
      ) : loading || !data ? (
        <Loading />
      ) : data.fundraiser ? (
        <FundraiserInvestorCard fundraiser={data.fundraiser} embed />
      ) : null}
    </div>
  );
}
