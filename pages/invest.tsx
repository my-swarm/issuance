import React, { ReactElement, useState } from 'react';
import { Drawer, Col, Row, Divider } from 'antd';
import { DefaultLayout, Loading, FundraiserInvestorCard, FundraiserInvestorAction, TokenInfo } from '@components';
import { useInvestQuery, FundraiserWithTokenFragment } from '@graphql';
import { InvestTokenDetails } from '../@components/invest/InvestTokenDetails';
import { InvestFundraiserDetails } from '../@components/invest/InvestFundraiserDetail';
import { InvestContribute } from '../@components/invest/InvestContribute';
import { useDispatch } from '@app';
import { OnlineToken } from '@lib';

export default function InvestPage(): ReactElement {
  const [action, setAction] = useState<FundraiserInvestorAction>();
  const [fundraiser, setFundraiser] = useState<FundraiserWithTokenFragment>();
  const { setToken } = useDispatch();
  const { data, loading } = useInvestQuery();
  if (loading) return <Loading />;
  const { fundraisers } = data;

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

    const { token } = fundraiser;
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
    <DefaultLayout title="Invest">
      <Row gutter={16}>
        {fundraisers.map((fundraiser) => (
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
      </Drawer>
    </DefaultLayout>
  );
}
