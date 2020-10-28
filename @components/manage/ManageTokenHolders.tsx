import React, { ReactElement, useState } from 'react';
import moment from 'moment';
import { Button, Checkbox, Col, Dropdown, Menu, Popconfirm, Row, Select, Space, Table } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';

import { useAppState, useContractAddress, useDispatch, useEthers, useGraphql } from '@app';
import {
  ContributorFragment,
  ContributorStatus,
  TokenHolderFragment,
  useTokenHoldersQuery,
  useWhitelistGreylistQuery,
} from '@graphql';
import { Loading, FilterDropdown, AccountsAddModal, EditableCell, Address } from '@components';
import { createPagination } from './listUtils';
import { ColumnType } from 'antd/lib/table';
import { formatDate, formatDatetime } from '../../@lib';
import { formatUnits } from 'ethers/lib/utils';

interface TableRecord {
  address: string;
  name: string;
  note: string;
  createdAt: Date;
}

type RawAccount = TokenHolderFragment;
type RawAccountList = RawAccount[];

type TableList = TableRecord[];

function tableColumns(columns: ColumnType<TableRecord>[]): ColumnType<TableRecord>[] {
  return columns.map((column) => ({ ...column, dataIndex: column.key }));
}

const sortOptions = ['address', 'createdAt', 'balance'];

export function ManageTokenHolders(): ReactElement {
  const { reset } = useGraphql();
  const [{ token }] = useAppState();
  const [sort, setSort] = useState<string>('balance');
  const [searchText, setSearchText] = useState<string>('');
  const [paginate, setPaginate] = useState<boolean>(true);
  const { networkId } = useEthers();
  const { dispatchTransaction, setAccountProp } = useDispatch();
  const { src20: src20Address } = useContractAddress();
  const { loading, error, data } = useTokenHoldersQuery({
    variables: { token: src20Address },
  });
  if (loading) return <Loading />;

  let tableData: TableList = data.tokenHolders
    .map((a) => {
      const tokenAccountList = token.networks[networkId].accounts || {};
      return {
        ...a,
        key: a.address, // for the table
        balance: parseFloat(formatUnits(a.balance, token.decimals)),
        ...tokenAccountList[a.address],
      };
    })
    .filter((a) => `${a.address} ${a.name} ${a.note}`.toLowerCase().includes(searchText.toLowerCase()));

  console.log({ tableData });

  tableData = _.sortBy(tableData, [sort]);

  const renderAction = (text, record: TokenHolderFragment) => {
    const enableFreeze = !record.isFrozen;
    const enableUnfreeze = record.isFrozen;
    const enableBurn =
    const enableRemove = record.status === ContributorStatus.Pending || record.status === ContributorStatus.Qualified;
    if (enableConfirm || enableRemove) {
      const menu = (
        <Menu>
          {enableConfirm && <Menu.Item onClick={() => handleConfirm(record.address)}>Confirm</Menu.Item>}
          {enableRemove && <Menu.Item onClick={() => handleRemove(record.address)}>Remove</Menu.Item>}
        </Menu>
      );
      return (
        <Dropdown overlay={menu} trigger={['click']}>
          <span className="cursor-pointer">
            action <DownOutlined />
          </span>
        </Dropdown>
      );
    } else {
      return null;
    }
  };

  const columns = tableColumns([
    {
      title: 'Address',
      key: 'address',
      render: (value) => (
        <Address short link>
          {value}
        </Address>
      ),
    },
    {
      title: 'First transaction',
      key: 'createdAt',
      render: formatDatetime,
    },
    {
      title: 'Balance',
      key: 'balance',
      align: 'right',
    },
    {
      title: 'Name',
      key: 'name',
      className: 'editable-cell',
      render: (value, row) => (
        <EditableCell value={value} onChange={(value) => setAccountProp(row.address, 'name', value)} />
      ),
    },
    {
      title: 'Note',
      key: 'note',
      className: 'editable-cell',
      render: (value, row) => (
        <EditableCell value={value} onChange={(value) => setAccountProp(row.address, 'note', value)} />
      ),
    },
    {
      title: 'Do',
      key: 'action',
      render: renderAction,
      filterDropdown: <FilterDropdown onChange={(t) => setSearchText(t)} />,
      filterIcon: <SearchOutlined />,
      // onFilterDropdownVisibleChange: (visible) => visible && setTimeout(() => searchInput.current.select(), 100),
    },
  ]);

  return (
    <>
      {tableData.length > 0 && (
        <div className="text-right mb-2">
          <Space>
            sort by:{' '}
            <Select
              options={sortOptions.map((x) => ({ label: x, value: x }))}
              value={sort}
              onChange={(val) => setSort(val)}
              size="small"
              dropdownMatchSelectWidth={false}
            />
            <Checkbox onChange={(e) => setPaginate(e.target.checked)} checked={paginate}>
              {' '}
              paginate
            </Checkbox>
          </Space>
        </div>
      )}

      <div style={{ maxHeight: '40rem', overflowY: 'auto' }}>
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
