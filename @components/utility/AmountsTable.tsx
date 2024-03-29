import React, { ReactElement } from 'react';
import { Address } from '@components';
import { formatUnits, LocalToken } from '@lib';
import { Table } from 'antd';
import { BigNumber } from '@ethersproject/bignumber';

interface AmountsTableProps {
  addresses: string[];
  amounts: number[] | BigNumber[];
  token: Pick<LocalToken, 'decimals' | 'symbol'>;
}

export function AmountsTable({ amounts, addresses, token }: AmountsTableProps): ReactElement {
  return (
    <Table
      size="small"
      dataSource={addresses.map((address, index) => ({ key: index, address, amount: amounts[index] }))}
      pagination={false}
      columns={[
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
          render: (address) => <Address short>{address}</Address>,
        },
        {
          title: 'Token amount',
          dataIndex: 'amount',
          key: 'amount',
          align: 'right',
          render: (value) =>
            (typeof value === 'number' ? value.toString() : Math.round(parseInt(formatUnits(value, token.decimals)))) +
            ' ' +
            token.symbol,
        },
      ]}
    />
  );
}
