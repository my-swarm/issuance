import React from 'react';
import { DefaultLayout } from '@components';
import { Card, Col, Divider, Row, Space, Tag } from 'antd';
import { useAppState } from '@app';
import { AppstoreOutlined, DollarCircleOutlined, LineChartOutlined, WalletOutlined } from '@ant-design/icons';

interface IndexProps {
  title?: string;
}

export default function Index({ title }: IndexProps) {
  const [{ tokens }] = useAppState();

  return (
    <DefaultLayout title="Welcome to MySwarm Investment Portal">
      <Row gutter={24}>
        <Col xs={24} sm={12} lg={6}>
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
                <span>Issue Tokens</span>
              </>,
              <>
                <LineChartOutlined />
                <span>Explore Fundraisers</span>
              </>,
            ]}
          >
            <Card.Meta
              title="I want to issue a security token"
              description="Deploy your own security token with ease."
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            cover={
              <div className="index-card-cover">
                <img alt="Investor illustration" src="/illustrations/undraw_finance_0bdk.svg" />
              </div>
            }
            actions={[
              <>
                <DollarCircleOutlined />
                <span>Invest</span>
              </>,
              <>
                <WalletOutlined />
                <span>Wallet</span>
              </>,
            ]}
          >
            <Card.Meta
              title={
                <Space>
                  <span>I want to invest</span>
                  <Tag color="#108ee9">Coming soon</Tag>
                </Space>
              }
              description="Invest now."
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
