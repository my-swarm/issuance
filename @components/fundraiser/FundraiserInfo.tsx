import React, { ReactElement } from 'react';
import { Descriptions } from 'antd';
import { formatDate, formatNumber, BASE_CURRENCIES } from '@lib';
import { formatUnits } from 'ethers/lib/utils';
import { FundraiserInfoFragment } from '@graphql';

interface FundraiserInfoProps {
  fundraiser: FundraiserInfoFragment;
  column?: number;
}

export function FundraiserInfo({ fundraiser, column = 1 }: FundraiserInfoProps): ReactElement {
  const baseCurrency = BASE_CURRENCIES.USDC;

  const softCap = parseFloat(formatUnits(fundraiser.softCap, baseCurrency.decimals));
  const hardCap = parseFloat(formatUnits(fundraiser.hardCap, baseCurrency.decimals));
  const amountQualified = parseFloat(formatUnits(fundraiser.amountQualified, baseCurrency.decimals));
  const raisedPercent = (amountQualified / softCap) * 100;

  return (
    <Descriptions title="Fundraiser Info" column={column} size="small">
      <Descriptions.Item label="Start Date">{formatDate(fundraiser.startDate)}</Descriptions.Item>
      <Descriptions.Item label="End Date">{formatDate(fundraiser.endDate)}</Descriptions.Item>
      <Descriptions.Item label="Soft cap">{softCap} USD</Descriptions.Item>
      <Descriptions.Item label="Hard cap">{hardCap} USD</Descriptions.Item>
      <Descriptions.Item label="Raised so far">
        {amountQualified} USD ({formatNumber(raisedPercent, 2)} %)
      </Descriptions.Item>
    </Descriptions>
  );
}
