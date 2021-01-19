import React, { ReactElement } from 'react';
import { Card, Col, Typography, Row, Modal } from 'antd';
import { FundraiserWithTokenFragment } from '@graphql';
import { FundraiserCountdown } from './FundraiserCountdown';
import { Address, CardAction, FundraiserStatusChart, ImagePreview, PoweredBySwarm } from '..';
import { useEthers, useKya } from '@app';
import { AppstoreOutlined, DollarCircleOutlined, LineChartOutlined, LoadingOutlined } from '@lib/icons';
import { OnlineToken } from '@lib';

const { Text } = Typography;

export enum FundraiserInvestorAction {
  TokenDetails,
  FundraiserDetails,
  Invest,
}

interface FundraiserInvestorCardProps {
  fundraiser: FundraiserWithTokenFragment;
  onAction?: (action: FundraiserInvestorAction) => void;
  embed?: boolean;
}

export function FundraiserInvestorCard({
  fundraiser,
  onAction = () => {
    console.log('no action handler');
  },
  embed = false,
}: FundraiserInvestorCardProps): ReactElement {
  const { token, baseCurrency } = fundraiser;
  const { address } = useEthers();

  console.log({ token });
  // todo: as OnlineToken is a quick hack. Should restructure the fragments
  const { kya } = useKya(token as OnlineToken);

  const handleTokenDetails = () => {
    onAction(FundraiserInvestorAction.TokenDetails);
  };

  const handleFundraiserDetails = () => {
    onAction(FundraiserInvestorAction.FundraiserDetails);
  };

  const handleContribute = () => {
    if (!address) {
      Modal.error({
        title: 'Not connected',
        content: 'Please connect to Ethereum network first (using Metamask or similar)',
      });
    } else {
      onAction(FundraiserInvestorAction.Invest);
    }
  };

  const extra = embed ? <PoweredBySwarm /> : null;
  const actions = embed
    ? null
    : [
        <CardAction onClick={handleTokenDetails} icon={<AppstoreOutlined />} title="Token details" key={1} />,
        <CardAction
          onClick={handleFundraiserDetails}
          icon={<LineChartOutlined />}
          title="Fundraiser details"
          key={2}
        />,
        <CardAction onClick={handleContribute} icon={<DollarCircleOutlined />} title="Contribute" key={3} />,
      ];

  return (
    <Card
      className={`c-fundraiser-investor-card ${embed ? 'standalone' : ''}`}
      title={
        <>
          <div>
            {token.name} ({token.symbol})
          </div>
          <Text type="secondary">{fundraiser.label}</Text>
        </>
      }
      actions={actions}
      extra={extra}
    >
      <Card.Grid hoverable={false} className="token">
        {kya ? (
          <Row gutter={16}>
            <Col span={10}>
              <ImagePreview image={kya.token.image} fitWidth />
            </Col>
            <Col span={14}>
              <Typography.Text type="secondary">{(kya.token.description || '').substr(0, 160)}</Typography.Text>
            </Col>
          </Row>
        ) : (
          <LoadingOutlined />
        )}
      </Card.Grid>

      <Card.Grid hoverable={false} className="countdown">
        <FundraiserCountdown startDate={fundraiser.startDate} endDate={fundraiser.endDate} />
      </Card.Grid>
      <Card.Grid hoverable={false} className="status">
        <FundraiserStatusChart
          softCap={fundraiser.softCap}
          hardCap={fundraiser.hardCap}
          amount={fundraiser.amountQualified}
          decimals={baseCurrency?.decimals}
        />
      </Card.Grid>
    </Card>
  );
}
