import React, { ReactElement } from 'react';
import { Card, Row, Col } from 'antd';
import { FundraiserFragment } from '@graphql';
import { useAppState, useEthers } from '@app';
import { FundraiserChart } from './FundraiserChart';
import { FundraiserInfo } from './FundraiserInfo';

interface FundraiserCardProps {
  fundraiser: FundraiserFragment;
}

export function FundraiserCard({ fundraiser }: FundraiserCardProps): ReactElement {
  const { networkId } = useEthers();
  const [{ tokens }] = useAppState();
  const extra = <a href="#">Manage</a>;

  // const token = tokens.find((t) => t.networks[networkId]?.addresses?.src20 === fundraiser.token.id);

  return (
    <Card title={fundraiser.label} extra={extra}>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <FundraiserChart fundraiser={fundraiser} />
        </Col>
        <Col xs={24} lg={12}>
          <FundraiserInfo fundraiser={fundraiser} />
        </Col>
      </Row>
    </Card>
  );
}
