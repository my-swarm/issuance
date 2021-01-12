import React, { ReactElement, useEffect, useState } from 'react';
import moment from 'moment';
import {
  BuySwmModal,
  DefaultLayout,
  InvestFundraisers,
  MasternodesChart,
  SwmPriceChart,
  SwmStakeChart,
} from '@components';
import { Button, Card, Col, Divider, Row, Space, Statistic } from 'antd';
import { PriceData, MasternodesData, RawMasternodeStats } from '@lib';
import { MASTERNODE_STAKE, SWM_STAKE_OLD_REGISTRY } from '@app';

const cgUrlStats = 'https://api.coingecko.com/api/v3/coins/swarm';
const cgUrlDaily =
  'https://api.coingecko.com/api/v3/coins/swarm/market_chart?vs_currency=usd&days=14&localization=false&interval=daily';
const mnUrlStats = 'https://api.masternode.swarm.fund/api/v1/nodes/statistic';
const mnUrlDaily = 'https://api.masternode.swarm.fund/api/v1/nodes/states-overview';

interface IndexProps {
  title?: string;
}

export default function Index({ title }: IndexProps): ReactElement {
  const colLayout = { xs: 24, lg: 12, xxl: 6 };
  const [buyingSwm, setBuyingSwm] = useState<boolean>(false);
  const [priceData, setPriceData] = useState<PriceData>();
  const [mnData, setMnData] = useState<MasternodesData>();
  const [mnRoi, setMnRoi] = useState<number>();
  const [numMnNodes, setNumMnNodes] = useState<number>();
  const [swmCircSupply, setSwmCircSupply] = useState<number>();

  const cgRequest = (url: string, callback: (data: any) => void) => {
    fetch(url)
      .then((response) => response.json())
      .then(callback)
      .catch((err) => {
        console.error('CoinGecko error');
        console.error(err.message);
      });
  };

  const mnRequest = (url: string, callback: (data: any) => void) => {
    fetch(url)
      .then((response) => response.json())
      .then(callback);
  };

  useEffect(() => {
    cgRequest(cgUrlStats, (data) => setSwmCircSupply(Math.round(data.market_data.circulating_supply)));
  }, [cgUrlStats]);

  useEffect(() => {
    cgRequest(cgUrlDaily, (data) => {
      setPriceData(
        data.prices.map((record) => ({ date: moment.unix(record[0] / 1000).format('YYYY-MM-DD'), price: record[1] })),
      );
    });
  }, [cgUrlDaily]);

  useEffect(() => {
    mnRequest(mnUrlDaily, (data) => {
      const latest = Object.values(data.result)[0] as RawMasternodeStats;
      setNumMnNodes(latest.ACTIVE + latest.WARMUP);
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
  }, [mnUrlDaily]);

  useEffect(() => {
    mnRequest(mnUrlStats, (data) => {
      setMnRoi(Math.floor(data.result.annualROI * 100) / 100);
    });
  }, [mnUrlStats]);

  const mnStake = MASTERNODE_STAKE * numMnNodes || undefined;

  return (
    <DefaultLayout title="Welcome to MySwarm Investment Portal">
      <Row gutter={[24, 24]} className="dashboard">
        <Col {...colLayout}>
          <Card
            title="SWARM token"
            extra={
              <a
                href="https://etherscan.io/token/0x3505f494c3f0fed0b594e01fa41dd3967645ca39"
                target="_blank"
                rel="noopener noreferrer"
              >
                more
              </a>
            }
          >
            <SwmStakeChart total={swmCircSupply} masternodes={mnStake} tokens={SWM_STAKE_OLD_REGISTRY} />
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
            <MasternodesChart data={mnData} numNodes={numMnNodes} roi={mnRoi} />
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
      <h2>Latest investment opportunities</h2>
      <InvestFundraisers limit={3} />

      {buyingSwm && <BuySwmModal onClose={() => setBuyingSwm(false)} />}
    </DefaultLayout>
  );
}
