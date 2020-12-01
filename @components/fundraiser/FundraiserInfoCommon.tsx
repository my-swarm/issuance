import React, { ReactElement } from 'react';
import { Descriptions } from 'antd';
import { formatDate, formatNumber, BASE_CURRENCIES } from '@lib';
import { formatUnits } from '@lib';
import { FundraiserFragment } from '@graphql';
import { Address } from '../utility';

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
      <Descriptions title="Fundraiser status" column={column} size="small">
        <Descriptions.Item label="Owner address">
          <Address short>{fundraiser.owner}</Address>
        </Descriptions.Item>
        <Descriptions.Item label="Status">{fundraiser.status}</Descriptions.Item>
        <Descriptions.Item label="Token supply">
          {formatUnits(fundraiser.supply, token.decimals, 'N/A')}
        </Descriptions.Item>
        <Descriptions.Item label="Token price">
          {formatUnits(fundraiser.tokenPrice, token.decimals, 'N/A')}
        </Descriptions.Item>
        <Descriptions.Item label="Start Date">{formatDate(fundraiser.startDate)}</Descriptions.Item>
        <Descriptions.Item label="End Date">{formatDate(fundraiser.endDate)}</Descriptions.Item>
        <Descriptions.Item label="Soft cap">{softCap} USD</Descriptions.Item>
        <Descriptions.Item label="Hard cap">{hardCap} USD</Descriptions.Item>
        <Descriptions.Item label="Amount raised">
          {amountQualified} USD ({formatNumber(raisedPercent, 2)} %)
        </Descriptions.Item>
        <Descriptions.Item label="Amount pending">
          {formatUnits(fundraiser.amountPending, baseCurrency.decimals)} USD
        </Descriptions.Item>
        <Descriptions.Item label="Qualified contributors">{fundraiser.numContributors}</Descriptions.Item>
      </Descriptions>
    </>
  );
}