import React from 'react';
import { DefaultLayout, MetamaskConnect } from '@components';
import { Row, Col, Card } from 'antd';
import Link from 'next/link';
import { useAppState } from '@app';
import { tokenStates } from '@types';

interface IndexProps {
  title?: string;
}

export default function Index({ title }: IndexProps) {
  const [{ tokens }] = useAppState();

  return (
    <DefaultLayout title="Welcome to MySwarm Investment Portal">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="I want to issue a security token">Deploy your own security token with ease.</Card>
        </Col>
        <Col span={12}>
          <Card title="I want to invest" extra="coming soon!">
            Invest now.
          </Card>
        </Col>
      </Row>
    </DefaultLayout>
  );
}
