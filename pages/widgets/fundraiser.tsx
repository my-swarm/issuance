import React, { useEffect, useState } from 'react';
import { Alert, Drawer } from 'antd';

import {
  FundraiserInvestorCard,
  Loading,
  getFundraiserActionTitle,
  FundraiserInvestorAction,
  TokenInfo,
  InvestFundraiserDetails,
  InvestContribute,
} from '@components';
import { useFundraiserWidgetLazyQuery } from '@graphql';
import { useRouter } from 'next/router';
import { useDispatch } from '@app';
import { OnlineToken } from '@lib';

export default function FundraiserWidget() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [action, setAction] = useState<FundraiserInvestorAction>();
  const [loadQuery, { data, loading }] = useFundraiserWidgetLazyQuery();
  const fundraiser = data?.fundraiser;
  const { setToken } = useDispatch();

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

  const handleAction = (action) => {
    setToken(undefined, fundraiser.token as OnlineToken);
    setAction(action);
  };

  const handleClearAction = () => {
    setAction(undefined);
  };

  function renderAction() {
    if (!fundraiser) return null;

    switch (action) {
      case FundraiserInvestorAction.TokenDetails:
        return <TokenInfo />;
      case FundraiserInvestorAction.FundraiserDetails:
        return <InvestFundraiserDetails id={fundraiser.id} />;
      case FundraiserInvestorAction.Invest:
        return <InvestContribute id={fundraiser.id} />;
    }
  }

  return (
    <div className="widget-fundraiser">
      {error ? (
        <Alert message={error} type="error" showIcon />
      ) : loading || !data ? (
        <Loading />
      ) : data.fundraiser ? (
        <>
          <FundraiserInvestorCard fundraiser={data.fundraiser} embed onAction={handleAction} />
          <Drawer
            title={getFundraiserActionTitle(action)}
            width="100%"
            visible={action !== undefined}
            closable={true}
            onClose={() => handleClearAction()}
          >
            {renderAction()}
          </Drawer>
        </>
      ) : null}
    </div>
  );
}
