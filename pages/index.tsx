import React from 'react';
import Link from 'next/link';
import { CardAction, DefaultLayout } from '@components';
import { Card, Col, Divider, Row, Space, Tag } from 'antd';
import { useAppState } from '@app';
import { AppstoreOutlined, DollarCircleOutlined, LineChartOutlined, WalletOutlined } from '@ant-design/icons';

interface IndexProps {
  title?: string;
}

export default function Index({ title }: IndexProps) {
  const [{ tokens }] = useAppState();

  const colLayout = { xs: 24, md: 12, lg: 8, lg: 8, xxl: 6 };

  return (
    <DefaultLayout title="Welcome to MySwarm Investment Portal">
      <Row gutter={24}>
        <Col {...colLayout}>
          <Card
            bordered={false}
            cover={
              <div className="index-card-cover">
                <img alt="Isssuer illustration" src="/illustrations/undraw_ethereum_desire_wy1b.svg" />
              </div>
            }
            actions={[
              <>
                <AppstoreOutlined />
                <span>Tokens</span>
              </>,
              <>
                <LineChartOutlined />
                <span>Fundraisers</span>
              </>,
            ]}
          >
            <Card.Meta
              title="As a token issuer"
              description="You can deploy and manage your security tokens and create fundraisers for them."
            />
          </Card>
        </Col>
        <Col {...colLayout}>
          <Card
            cover={
              <div className="index-card-cover">
                <img alt="Investor illustration" src="/illustrations/undraw_finance_0bdk.svg" />
              </div>
            }
            actions={[
              <CardAction href="/contribute" icon={<DollarCircleOutlined />} title="Invest" key="contribute" />,
              <CardAction href="/wallet" icon={<WalletOutlined />} title="Wallet" key="wallet" />,
            ]}
          >
            <Card.Meta
              title="As an investor"
              description="You can contribute to a fundraiser or manage the security tokens you already own."
            />
          </Card>
        </Col>
      </Row>
      <Divider />
      <h2>What is MySwarm?</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In bibendum ultricies eros a varius. Curabitur at justo
        neque. Fusce egestas augue sed sapien imperdiet tempor. Nulla facilisis venenatis mattis. Vivamus tincidunt
        massa ac ex aliquet volutpat. Sed suscipit, nisi in placerat scelerisque, tellus turpis aliquet nisi, eget
        rhoncus sem massa auctor magna. Donec vulputate lorem nibh, ut porta quam vestibulum vitae. Maecenas ut suscipit
        ante.
      </p>
      <ul>
        <li>
          Nam facilisis eros ut ipsum elementum pretium eget vel nisi. Aenean turpis lectus, dignissim eget elementum
          id, hendrerit sit amet lorem.
        </li>
        <li>
          Praesent tellus magna, molestie eu nisi in, interdum semper diam. Aliquam erat volutpat. Suspendisse potenti.
        </li>
        <li>
          Pellentesque lacinia leo eget velit vulputate, id interdum mauris semper. Quisque sed nisl at nunc pretium
          laoreet.
        </li>
      </ul>
    </DefaultLayout>
  );
}
