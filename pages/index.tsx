import React, { ReactElement, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  BuySwmModal,
  DefaultLayout,
  InvestFundraisers,
  SwmPriceChart,
  SwmStakeChart,
  UniswapWidget,
} from '@components';
import { Card, Col, Divider, Row, Space } from 'antd';
import { PriceData } from '@lib';
import { SWM_STAKE_OLD_REGISTRY } from '@app';

const cgUrlStats = 'https://api.coingecko.com/api/v3/coins/swarm';
const cgUrlDaily =
  'https://api.coingecko.com/api/v3/coins/swarm/market_chart?vs_currency=usd&days=14&localization=false&interval=daily';

export default function Index(): ReactElement {
  const colLayout = { xs: 24, lg: 12 };
  const [buyingSwm, setBuyingSwm] = useState<boolean>(false);
  const [priceData, setPriceData] = useState<PriceData>();
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

  useEffect(() => {
    cgRequest(cgUrlStats, (data) => setSwmCircSupply(Math.round(data.market_data.circulating_supply)));
  }, [cgUrlStats]);

  useEffect(() => {
    cgRequest(cgUrlDaily, (data) => {
      setPriceData(
        data.prices.map((record) => ({ date: dayjs.unix(record[0] / 1000).format('YYYY-MM-DD'), price: record[1] })),
      );
    });
  }, [cgUrlDaily]);

  return (
    <DefaultLayout title="Swarm Dashboard">
      <Row gutter={24} className="dashboard">
        <Col {...colLayout}>
          <Card
            title="SWARM token"
            style={{ marginBottom: '24px' }}
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
            <SwmStakeChart total={swmCircSupply} issuerStake={SWM_STAKE_OLD_REGISTRY} />
          </Card>
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
        <Col {...colLayout}>{<UniswapWidget />}</Col>
      </Row>
      <Divider />
      <h2>
        <Space>
          <img src="/images/swarm-symbol.svg" alt="Swarm symbol" className="h-4 w-a" />
          <span>Powered by Swarm</span>
        </Space>
      </h2>
      <InvestFundraisers limit={3} />

      {buyingSwm && <BuySwmModal onClose={() => setBuyingSwm(false)} />}
    </DefaultLayout>
  );
}
