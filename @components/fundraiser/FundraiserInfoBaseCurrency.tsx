import React, { ReactElement } from 'react';
import { Descriptions } from 'antd';
import { formatUnits } from '@lib';
import { FundraiserFragment } from '@graphql';
import { Address } from '../utility';

interface FundraiserInfoBaseCurrencyProps {
  fundraiser: FundraiserFragment;
  column?: number;
}

export function FundraiserInfoBaseCurrency({ fundraiser }: FundraiserInfoBaseCurrencyProps): ReactElement {
  const { baseCurrency } = fundraiser;

  return (
    <>
      <Descriptions title="Base currency" column={2} size="small">
        <Descriptions.Item label="Address">
          <Address short>{baseCurrency.address}</Address>
        </Descriptions.Item>
        <Descriptions.Item label="Name">
          <Address short>{baseCurrency.name}</Address>
        </Descriptions.Item>
        <Descriptions.Item label="Symbol">
          <Address short>{baseCurrency.symbol}</Address>
        </Descriptions.Item>
        <Descriptions.Item label="Decimals">
          <Address short>{baseCurrency.decimals}</Address>
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}
