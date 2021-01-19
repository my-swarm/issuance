import React, { ReactElement } from 'react';
import { Descriptions } from 'antd';
import { formatUnits } from '@lib';
import { FundraiserFragment } from '@graphql';
import { Address, TokenTitle } from '../utility';

interface FundraiserInfoBaseCurrencyProps {
  fundraiser: FundraiserFragment;
  column?: number;
}

export function FundraiserInfoBaseCurrency({ fundraiser }: FundraiserInfoBaseCurrencyProps): ReactElement {
  const { baseCurrency } = fundraiser;

  return (
    <>
      <Descriptions title="Base currency" column={1} bordered size="small" labelStyle={{ width: '40%' }}>
        <Descriptions.Item label="Address">
          <Address short>{baseCurrency.address}</Address>
        </Descriptions.Item>
        <Descriptions.Item label="Name">{baseCurrency.name}</Descriptions.Item>
        <Descriptions.Item label="Symbol">
          <TokenTitle token={baseCurrency} />
        </Descriptions.Item>
        <Descriptions.Item label="Decimals">{baseCurrency.decimals}</Descriptions.Item>
      </Descriptions>
    </>
  );
}
