import React, { ReactElement } from 'react';
import { Card, Row, Col } from 'antd';
import { FundraiserFragment } from '@graphql';
import { useAppState, useEthers } from '@app';
import { FundraiserProgressChart } from './FundraiserProgressChart';
import { FundraiserInfoCommon } from './FundraiserInfoCommon';

interface FundraiserCardProps {
  fundraiser: FundraiserFragment;
}

export function FundraiserIssuerCard({ fundraiser }: FundraiserCardProps): ReactElement {
  const { networkId } = useEthers();
  const [{ tokens }] = useAppState();
  const extra = <a href={`/tokens/?address=${fundraiser.address}action=manageFundraiser`}>Manage</a>;

  // const token = tokens.find((t) => t.networks[networkId]?.addresses?.src20 === fundraiser.token.id);

  return (
    <Card title={fundraiser.label} extra={extra}>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <FundraiserProgressChart fundraiser={fundraiser} />
        </Col>
        <Col xs={24} lg={12}>
          <FundraiserInfoCommon fundraiser={fundraiser} />
        </Col>
      </Row>
    </Card>
  );
}
