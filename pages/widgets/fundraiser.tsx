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
  MetamaskConnect,
  TransactionModal,
  SpendingApprovalModal,
} from '@components';
import { useFundraiserWidgetLazyQuery } from '@graphql';
import { useRouter } from 'next/router';
import { useAppState, useDispatch, useEthers } from '@app';
import { OnlineToken } from '@lib';

export default function FundraiserWidget() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [action, setAction] = useState<FundraiserInvestorAction>();
  const [loadQuery, { data, loading }] = useFundraiserWidgetLazyQuery();
  const fundraiser = data?.fundraiser;
  const { setToken } = useDispatch();
  const { connected } = useEthers();
  const [{ transaction, spendingApproval }] = useAppState();

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
        return (
          <div>
            {!connected && (
              <div className="mb-3">
                <MetamaskConnect />
              </div>
            )}
            <InvestContribute id={fundraiser.id} />
          </div>
        );
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
          {transaction && <TransactionModal />}
          {spendingApproval && <SpendingApprovalModal />}
        </>
      ) : null}
    </div>
  );
}
