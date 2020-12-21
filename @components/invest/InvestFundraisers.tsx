import React, { ReactElement, useMemo, useState } from 'react';
import { Col, Drawer, Row } from 'antd';
import {
  FundraiserInvestorAction,
  FundraiserInvestorCard,
  InvestFundraiserDetails,
  InvestContribute,
  Loading,
  TokenInfo,
} from '@components';
import { FundraiserWithTokenFragment, useInvestQuery } from '@graphql';
import { useDispatch } from '@app';
import { OnlineToken } from '@lib';
import dayjs from 'dayjs';

interface InvestFundraisersProps {
  count?: number;
}

export function InvestFundraisers({ count }: InvestFundraisersProps): ReactElement {
  const [action, setAction] = useState<FundraiserInvestorAction>();
  const [fundraiser, setFundraiser] = useState<FundraiserWithTokenFragment>();
  const { setToken } = useDispatch();
  const { data, loading } = useInvestQuery();

  const filteredFundraiesrs = useMemo(() => {
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

  function getActionTitle() {
    switch (action) {
      case FundraiserInvestorAction.TokenDetails:
        return 'Token details';
      case FundraiserInvestorAction.FundraiserDetails:
        return 'Fundraiser details';
      case FundraiserInvestorAction.Invest:
        return 'Invest';
    }
  }

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
    <>
      <Row gutter={16}>
        {filteredFundraiesrs.map((fundraiser) => (
          <Col md={12} xxl={8} key={fundraiser.id}>
            <FundraiserInvestorCard fundraiser={fundraiser} onAction={(action) => handleAction(action, fundraiser)} />
          </Col>
        ))}
      </Row>
      <Drawer
        title={getActionTitle()}
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
