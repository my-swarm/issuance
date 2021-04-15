import React, { ReactElement } from 'react';
import { Descriptions, Divider } from 'antd';
import { formatDate, formatNumber } from '@lib';
import { formatUnits } from '@lib';
import { FundraiserFragment } from '@graphql';
import { Address, VSpace } from '../utility';

interface FundraiserInfoCommonProps {
  fundraiser: FundraiserFragment;
  column?: number;
}

export function FundraiserInfoCommon({ fundraiser, column = 1 }: FundraiserInfoCommonProps): ReactElement {
  const { token, baseCurrency } = fundraiser;

  const softCap = parseFloat(formatUnits(fundraiser.softCap, baseCurrency.decimals));
  const hardCap = parseFloat(formatUnits(fundraiser.hardCap, baseCurrency.decimals));
  const amountQualified = parseFloat(formatUnits(fundraiser.amountQualified, baseCurrency.decimals));
  const raisedPercent = (amountQualified / softCap) * 100;

  return (
    <>
      <Descriptions
        title="Fundraiser setup"
        column={1}
        bordered
        size="small"
        className="mb-4"
        labelStyle={{ width: '40%' }}
      >
        <Descriptions.Item label="Owner address">
          <Address short>{fundraiser.owner}</Address>
        </Descriptions.Item>
        <Descriptions.Item label="Token supply">
          {formatUnits(fundraiser.supply, token.decimals, 'N/A')}
        </Descriptions.Item>
        <Descriptions.Item label="Token price">
          {formatUnits(fundraiser.tokenPrice, baseCurrency.decimals, 'N/A')} USD
        </Descriptions.Item>
        <Descriptions.Item label="Start Date">{formatDate(fundraiser.startDate)}</Descriptions.Item>
        <Descriptions.Item label="End Date">{formatDate(fundraiser.endDate)}</Descriptions.Item>
        <Descriptions.Item label="Soft cap">{softCap} USD</Descriptions.Item>
        <Descriptions.Item label="Hard cap">{hardCap} USD</Descriptions.Item>
      </Descriptions>
      <Descriptions title="Fundraiser status" column={1} bordered size="small" labelStyle={{ width: '40%' }}>
        <Descriptions.Item label="Status">{fundraiser.status}</Descriptions.Item>
        <Descriptions.Item label="Amount raised">
          {amountQualified} USD ({formatNumber(raisedPercent, 2)} %)
        </Descriptions.Item>
        <Descriptions.Item label="Amount pending">
          {formatUnits(fundraiser.amountPending, baseCurrency.decimals)} USD
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}
