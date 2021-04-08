import React, { ReactElement, useState } from 'react';
import { LeftCircleTwoTone, LoadingOutlined, RightCircleTwoTone, SearchOutlined } from '@lib/icons';

import { TokenInfoFragment, TransferFragment } from '@graphql';
import { renderAddress, tableColumns } from '../manage/listUtils';
import { formatDatetime, sameAddress, strcmp, formatUnits } from '@lib';
import { FilterDropdown, PaginatedTable, TransferDirection } from '@components';
import { useAppState, useEthers } from '@app';
import { Tooltip } from 'antd';

interface TableRecord {
  from: string;
  to: string;
  value: number;
  createdAt: number;
  isPending: boolean;
}

interface TransferHistoryProps {
  token: TokenInfoFragment;
  transfers: TransferFragment[];
  direction?: boolean;
}

export function TransferHistory({ token, transfers, direction = false }: TransferHistoryProps): ReactElement {
  const { address } = useEthers();
  const [searchText, setSearchText] = useState<string>('');
  const [{ pendingTransactions }] = useAppState();

  const transferDirectionCols = direction
    ? [
        {
          title: '',
          key: 'dir',
          render: (val, row) => (
            <TransferDirection myAddress={address} toAddress={row.toAddress} pending={row.isPending} />
          ),
        },
      ]
    : [];

  const columns = tableColumns<TableRecord>([
    ...transferDirectionCols,
    {
      title: 'Date/Time',
      key: 'createdAt',
      render: formatDatetime,
      sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
      title: 'From',
      key: 'from',
      render: renderAddress,
      sorter: (a, b) => strcmp(a.from, b.from),
    },
    {
      title: 'To',
      key: 'to',
      render: renderAddress,
      sorter: (a, b) => strcmp(a.to, b.to),
    },
    {
      title: 'Value',
      key: 'value',
      align: 'right',
      sorter: (a, b) => a.value - b.value,
      filterDropdown: <FilterDropdown onChange={(t) => setSearchText(t)} />,
      filterIcon: <SearchOutlined />,
    },
  ]);

  const oldTransfers: TableRecord[] = transfers
    .map((a) => {
      return {
        ...a,
        from: a.fromAddress,
        to: a.toAddress,
        key: a.id, // for the table
        value: parseFloat(formatUnits(a.value, token.decimals)),
        isPending: false,
      };
    })
    .filter((a) => `${a.from} ${a.to}`.toLowerCase().includes(searchText.toLowerCase()));

  const pendingTransfers: TableRecord[] = pendingTransactions
    .filter((tx) => tx.contract === 'src20' && tx.method === 'transfer' && sameAddress(tx.address, token.address))
    .map((tx) => ({
      from: tx.address,
      to: tx.args[0],
      value: parseFloat(formatUnits(tx.args[1], token.decimals)),
      createdAt: Math.round(Date.now() / 1000),
      isPending: true,
    }));
  const dataSource = [...pendingTransfers, ...oldTransfers];

  return (
    <>
      <div className="limit-height">
        <PaginatedTable
          size="small"
          columns={columns}
          dataSource={dataSource}
          className="mb-3"
          rowClassName="editable-row"
        />
      </div>
    </>
  );
}
