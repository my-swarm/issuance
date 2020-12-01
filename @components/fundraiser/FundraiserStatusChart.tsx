import React, { ReactElement } from 'react';
import { BigNumber, BigNumberish } from 'ethers';
import { Col, Progress, Row, Space, Statistic } from 'antd';
import { formatUnits } from '@lib';

interface FundraiserStatusChartProps {
  softCap: BigNumberish;
  hardCap: BigNumberish;
  amount: BigNumberish;
  decimals: number;
}

const colorRaised = '#13c2c2';
const colorSoftCap = '#52c41a';
const colorHardCap = '#a0d911';

export function FundraiserStatusChart({
  softCap,
  hardCap,
  amount,
  decimals,
}: FundraiserStatusChartProps): ReactElement {
  softCap = BigNumber.from(softCap);
  hardCap = BigNumber.from(hardCap);
  amount = BigNumber.from(amount);
  const softCapPercent = softCap.mul(100).div(hardCap).toNumber();
  const amountPercent = amount.mul(100).div(hardCap).toNumber();

  return (
    <div>
      <Row>
        <Col span={8}>
          <Statistic title="Raised" value={formatUnits(amount, decimals)} valueStyle={{ color: colorRaised }} />
        </Col>
        <Col span={8} style={{ textAlign: 'center' }}>
          <Statistic title="Soft Cap" value={formatUnits(softCap, decimals)} valueStyle={{ color: colorSoftCap }} />
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          <Statistic title="Hard Cap" value={formatUnits(hardCap, decimals)} valueStyle={{ color: colorHardCap }} />
        </Col>
      </Row>
      <Progress
        percent={softCapPercent}
        strokeColor={colorSoftCap}
        success={{ percent: amountPercent, strokeColor: colorRaised }}
        trailColor={colorHardCap}
      />
    </div>
  );
}
