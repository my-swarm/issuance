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
    <DefaultLayout title="Home">
      <Row>
        <Col span={12}>
          <Card
            title="My Tokens"
            extra={
              <Link href="/tokens">
                <a>Manage tokens</a>
              </Link>
            }
          >
            {tokens.map((token) => (
              <Row key={token.id}>
                <Col span={12}>
                  {token.name} ({token.symbol})
                </Col>
                <Col span={12}>{tokenStates[token.state]}</Col>
              </Row>
            ))}
          </Card>
        </Col>
      </Row>
    </DefaultLayout>
  );
}
