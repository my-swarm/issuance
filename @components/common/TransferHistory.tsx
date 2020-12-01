import React, { ReactElement, useState } from 'react';
import { LeftCircleTwoTone, RightCircleTwoTone, SearchOutlined } from '@ant-design/icons';

import { TokenInfoFragment, TransferFragment } from '@graphql';
import { renderAddress, tableColumns } from '../manage/listUtils';
import { formatDatetime, strcmp } from '@lib';
import { FilterDropdown, PaginatedTable } from '@components';
import { formatUnits } from 'ethers/lib/utils';
import { useEthers } from '@app';

interface TableRecord {
  from: string;
  to: string;
  value: number;
  createdAt: number;
}

interface TransferHistoryProps {
  token: TokenInfoFragment;
  transfers: TransferFragment[];
  direction?: boolean;
}

export function TransferHistory({ token, transfers, direction = false }: TransferHistoryProps): ReactElement {
  const { address } = useEthers();
  const [searchText, setSearchText] = useState<string>('');

  const transferDirectionCols = direction
    ? [
        {
          title: '',
          key: 'dir',
          render: (val, row) =>
            row.toAddress === address ? (
              <RightCircleTwoTone twoToneColor="green" title="Incoming transfer" />
            ) : (
              <LeftCircleTwoTone twoToneColor="red" label="Outgoing transfer" />
            ),
        },
      ]
    : [];

  console.log({ direction });

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

  const dataSource: TableRecord[] = transfers
    .map((a) => {
      return {
        ...a,
        from: a.fromAddress,
        to: a.toAddress,
        key: a.id, // for the table
        value: parseFloat(formatUnits(a.value, token.decimals)),
      };
    })
    .filter((a) => `${a.from} ${a.to}`.toLowerCase().includes(searchText.toLowerCase()));
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
