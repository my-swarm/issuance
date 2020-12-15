import React, { ReactElement, useState } from 'react';
import { Drawer, Col, Row } from 'antd';
import { DefaultLayout, Loading, FundraiserInvestorCard, FundraiserInvestorAction } from '@components';
import { useInvestQuery, FundraiserWithTokenFragment } from '@graphql';
import { InvestTokenDetails } from '../@components/invest/InvestTokenDetails';
import { InvestFundraiserDetails } from '../@components/invest/InvestFundraiserDetail';
import { InvestContribute } from '../@components/invest/InvestContribute';

export default function InvestPage(): ReactElement {
  const [action, setAction] = useState<FundraiserInvestorAction>();
  const [fundraiser, setFundraiser] = useState<FundraiserWithTokenFragment>();
  const { data, loading } = useInvestQuery();
  console.log({ loading, data });
  if (loading) return <Loading />;
  const { fundraisers } = data;

  const handleAction = (newAction: FundraiserInvestorAction, fundraiser: FundraiserWithTokenFragment) => {
    setFundraiser(fundraiser);
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
        return <InvestTokenDetails />;
      case FundraiserInvestorAction.FundraiserDetails:
        return <InvestFundraiserDetails id={fundraiser.id} />;
      case FundraiserInvestorAction.Invest:
        return <InvestContribute id={fundraiser.id} />;
    }
  }

  return (
    <DefaultLayout title="Invest">
      <h1>This is a list of all fundraisers</h1>
      <p>Blah blah...</p>
      <p>Todo:</p>
      <ul>
        <li>Filter fundraisers (by name, by fundraiser status, by my contributor status)</li>
        <li>Show my contribution in the card</li>
      </ul>

      <Row gutter={16}>
        {fundraisers.map((fundraiser) => (
          <Col span={12} key={fundraiser.id}>
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
