import React, { ReactElement, useEffect, useState } from 'react';
import moment from 'moment';
import { BuySwmModal, DefaultLayout, MasternodesChart, SwmPriceChart, SwmStakeChart } from '@components';
import { Button, Card, Col, Divider, Row, Space, Statistic } from 'antd';
import { PriceData, MasternodesData, RawMasternodeStats } from '@lib';

const cgUrl =
  'https://api.coingecko.com/api/v3/coins/swarm/market_chart?vs_currency=usd&days=14&localization=false&interval=daily';
const mnUrl = 'https://api.masternode.swarm.fund/api/v1/nodes/states-overview';

interface IndexProps {
  title?: string;
}

export default function Index({ title }: IndexProps): ReactElement {
  const colLayout = { xs: 24, md: 12, lg: 6 };
  const [buyingSwm, setBuyingSwm] = useState<boolean>(false);
  const [priceData, setPriceData] = useState<PriceData>();
  const [mnData, setMnData] = useState<MasternodesData>();

  useEffect(() => {
    fetch(cgUrl)
      .then((response) => response.json())
      .then((data) => {
        setPriceData(
          data.prices.map((record) => ({ date: moment.unix(record[0] / 1000).format('YYYY-MM-DD'), price: record[1] })),
        );
      })
      .catch((err) => {
        console.error('CoinGecko error');
        console.error(err.message);
      });
  }, [cgUrl]);

  useEffect(() => {
    fetch(mnUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('mnn data raw', data);
        setMnData(
          Object.entries(data.result).map(([date, nodeStats]: [string, RawMasternodeStats]) => {
            return {
              date: date,
              active: nodeStats.ACTIVE,
              warmup: nodeStats.WARMUP,
            };
          }),
        );
      });
  }, [mnUrl]);

  const firstPrice = priceData?.[0].price;
  const lastPrice = priceData?.[priceData.length - 1].price;
  const priceDirection: 'up' | 'down' = firstPrice > lastPrice ? 'up' : 'down';
  const priceChangePercent = firstPrice
    ? (priceDirection === 'up' ? lastPrice / firstPrice - 1 : firstPrice / lastPrice - 1) * 100
    : 0;

  return (
    <DefaultLayout title="Welcome to MySwarm Investment Portal">
      <Row gutter={24} className="dashboard">
        <Col {...colLayout}>
          <Card title="SWM stake">
            <SwmStakeChart total={1000} masternodes={200} tokens={100} />
          </Card>
        </Col>
        <Col {...colLayout}>
          <Card
            title="SWM price (2 weeks)"
            extra={
              <a href="https://www.coingecko.com/en/coins/swarm-fund" target="_blank" rel="noopener noreferrer">
                more
              </a>
            }
          >
            <Row className="mb-3">
              <Col xs={12}>
                <Statistic title="Current" value={lastPrice} precision={4} valueStyle={{ color: 'green' }} />
              </Col>
              <Col xs={12}>
                <Statistic
                  title="Change"
                  value={priceChangePercent}
                  precision={2}
                  suffix="%"
                  valueStyle={{ color: 'red' }}
                />
              </Col>
            </Row>
            <SwmPriceChart data={priceData} />
          </Card>
        </Col>
        <Col {...colLayout}>
          <Card
            title="Masternodes"
            extra={
              <a href="https://masternodes.swarmnetwork.org" target="_blank" rel="noopener noreferrer">
                more
              </a>
            }
          >
            <Row className="mb-3">
              <Col xs={12}>
                <Statistic title="Online nodes" value={404} valueStyle={{ color: 'green' }} />
              </Col>
              <Col xs={12}>
                <Statistic title="Annual ROI" value={6.84} suffix="%" valueStyle={{ color: 'red' }} />
              </Col>
            </Row>
            <MasternodesChart data={mnData} />
          </Card>
        </Col>
        <Col {...colLayout}>
          <Card title="Buy SWM">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                className="button-with-image"
                icon={<img src="/images/balancer.svg" alt="Balancer icon" />}
                size="large"
                block
              >
                Balancer
              </Button>
              <Button
                className="button-with-image"
                icon={<img src="/images/uniswap.svg" alt="Uniswap icon" />}
                size="large"
                block
              >
                Uniswap
              </Button>
            </Space>

            <Divider />
            <Button size="large" type="primary" block onClick={() => setBuyingSwm(true)}>
              Quick buy now
            </Button>
          </Card>
        </Col>
      </Row>
      <Divider />

      {buyingSwm && <BuySwmModal onClose={() => setBuyingSwm(false)} />}
    </DefaultLayout>
  );
}
