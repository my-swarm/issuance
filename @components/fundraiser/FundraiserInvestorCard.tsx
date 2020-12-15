import React, { ReactElement } from 'react';
import { Card, Col, Row } from 'antd';
import { FundraiserWithTokenFragment } from '@graphql';
import { AppstoreOutlined, DollarCircleOutlined, LineChartOutlined } from '@ant-design/icons';
import { FundraiserCountdown } from './FundraiserCountdown';
import { CardAction, FundraiserStatusChart } from '..';

export enum FundraiserInvestorAction {
  TokenDetails,
  FundraiserDetails,
  Invest,
}

interface FundraiserInvestorCardProps {
  fundraiser: FundraiserWithTokenFragment;
  onAction: (action: FundraiserInvestorAction) => void;
}

export function FundraiserInvestorCard({ fundraiser, onAction }: FundraiserInvestorCardProps): ReactElement {
  const { token, baseCurrency } = fundraiser;

  const handleTokenDetails = () => {
    onAction(FundraiserInvestorAction.TokenDetails);
  };

  const handleFundraiserDetails = () => {
    onAction(FundraiserInvestorAction.FundraiserDetails);
  };

  const handleContribute = () => {
    onAction(FundraiserInvestorAction.Invest);
  };

  return (
    <Card
      title={`${token.name} (${token.symbol})`}
      actions={[
        <CardAction onClick={handleTokenDetails} icon={<AppstoreOutlined />} title="Token details" key={1} />,
        <CardAction
          onClick={handleFundraiserDetails}
          icon={<LineChartOutlined />}
          title="Fundraiser details"
          key={2}
        />,
        <CardAction onClick={handleContribute} icon={<DollarCircleOutlined />} title="Invest" key={3} />,
      ]}
    >
      <h2>Token info</h2>
      <p>TBD: Need to implement freaking KYA first.</p>
      <p>Will have an image, description, NAV docs, all that shit.</p>

      <h2>Fundraiser status</h2>
      <Row>
        <Col span={12}>
          <FundraiserCountdown startDate={fundraiser.startDate} endDate={fundraiser.endDate} />
        </Col>
        <Col span={12}>
          <FundraiserStatusChart
            softCap={fundraiser.softCap}
            hardCap={fundraiser.hardCap}
            amount={fundraiser.amountQualified}
            decimals={baseCurrency.decimals}
          />
        </Col>
      </Row>
    </Card>
  );
}
