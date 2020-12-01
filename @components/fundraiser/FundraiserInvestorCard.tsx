import React, { ReactElement } from 'react';
import { Card, Col, Row } from 'antd';
import { FundraiserWithTokenFragment } from '@graphql';
import { AppstoreOutlined, DollarCircleOutlined, LineChartOutlined } from '@ant-design/icons';
import { FundraiserCountdown } from './FundraiserCountdown';
import { FundraiserStatusChart } from '..';

export enum FundraiserInvestorAction {
  TokenDetails,
  FundraiserDetails,
  Contribute,
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
    onAction(FundraiserInvestorAction.Contribute);
  };

  return (
    <Card
      title={`${token.name} (${token.symbol})`}
      actions={[
        <>
          <AppstoreOutlined onClick={handleTokenDetails} />
          <span onClick={handleTokenDetails}>Token details</span>
        </>,
        <>
          <LineChartOutlined onClick={handleFundraiserDetails} />
          <span onClick={handleFundraiserDetails}>Fundraiser details</span>
        </>,
        <>
          <DollarCircleOutlined onClick={handleContribute} />
          <span onClick={handleContribute}>Contribute</span>
        </>,
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
