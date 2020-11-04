import React, { ReactElement, useState } from 'react';
import { Checkbox, Space, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { useAppState, useContractAddress } from '@app';
import { useTransfersQuery } from '@graphql';
import { FilterDropdown, Loading } from '@components';
import { createPagination, renderAddress, tableColumns } from './listUtils';
import { ColumnType } from 'antd/lib/table';
import { formatDatetime, strcmp } from '@lib';
import { formatUnits } from 'ethers/lib/utils';

interface TableRecord {
  from: string;
  to: string;
  value: number;
  createdAt: number;
}

export function ManageTransferHistory(): ReactElement {
  const [{ token }] = useAppState();
  const [searchText, setSearchText] = useState<string>('');
  const [paginate, setPaginate] = useState<boolean>(true);
  const { src20: src20Address } = useContractAddress();
  const { loading, error, data } = useTransfersQuery({
    variables: { token: src20Address },
  });
  if (loading || !data) return <Loading />;
  const { transfers } = data.token;

  const tableData: TableRecord[] = transfers
    .map((a) => {
      return {
        ...a,
        from: a.from.address,
        to: a.to.address,
        key: a.id, // for the table
        value: parseFloat(formatUnits(a.value, token.decimals)),
      };
    })
    .filter((a) => `${a.from} ${a.to}`.toLowerCase().includes(searchText.toLowerCase()));

  const columns = tableColumns<TableRecord>([
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

  return (
    <>
      {tableData.length > 0 && (
        <div className="text-right mb-2">
          <Space>
            <Checkbox onChange={(e) => setPaginate(e.target.checked)} checked={paginate}>
              {' '}
              paginate
            </Checkbox>
          </Space>
        </div>
      )}

      <div className="limit-height">
        <Table
          size="small"
          columns={columns}
          dataSource={tableData}
          className="mb-3"
          rowClassName="editable-row"
          pagination={createPagination(!paginate, tableData.length)}
        />
      </div>
    </>
  );
}
