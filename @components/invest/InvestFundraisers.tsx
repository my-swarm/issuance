import React, { ReactElement, useMemo, useState } from 'react';
import { Drawer } from 'antd';
import {
  FundraiserInvestorAction,
  FundraiserInvestorCard,
  InvestContribute,
  InvestFundraiserDetails,
  Loading,
  TokenInfo,
} from '@components';
import { FundraiserWithTokenFragment, useInvestQuery } from '@graphql';
import { useDispatch } from '@app';
import { OnlineToken } from '@lib';
import dayjs from 'dayjs';

interface InvestFundraisersProps {
  limit?: number;
  offset?: number;
  search?: string;
}

export function getFundraiserActionTitle(action: FundraiserInvestorAction): string {
  switch (action) {
    case FundraiserInvestorAction.TokenDetails:
      return 'Token details';
    case FundraiserInvestorAction.FundraiserDetails:
      return 'Fundraiser details';
    case FundraiserInvestorAction.Invest:
      return 'Contribute';
  }
}

export function InvestFundraisers({ limit = 100, offset = 0, search = '' }: InvestFundraisersProps): ReactElement {
  const [action, setAction] = useState<FundraiserInvestorAction>();
  const [fundraiser, setFundraiser] = useState<FundraiserWithTokenFragment>();
  const { setToken } = useDispatch();
  const { data, loading } = useInvestQuery({ variables: { limit, search, offset } });

  const filteredFundraiesers = useMemo(() => {
    const nowTs = dayjs.unix(Math.round(Date.now() / 1000));
    return (data?.fundraisers || []).filter((f) => dayjs.unix(f.endDate) > nowTs);
  }, [data]);

  if (loading) return <Loading />;

  const handleAction = (newAction: FundraiserInvestorAction, fundraiser: FundraiserWithTokenFragment) => {
    setFundraiser(fundraiser);
    setToken(undefined, fundraiser.token as OnlineToken);
    setAction(newAction);
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

  if (filteredFundraiesers.length === 0) {
    return <p>Unfortunately there are no active fundraisers at the moment</p>;
  }

  return (
    <>
      <div className="clearfix">
        {filteredFundraiesers.map((fundraiser) => (
          <div className="fundraiser-card" key={fundraiser.address}>
            <FundraiserInvestorCard fundraiser={fundraiser} onAction={(action) => handleAction(action, fundraiser)} />
          </div>
        ))}
      </div>
      <Drawer
        title={getFundraiserActionTitle(action)}
        visible={action !== undefined}
        width="50%"
        closable={true}
        onClose={() => handleClearAction()}
      >
        {renderAction()}
      </Drawer>{' '}
    </>
  );
}
