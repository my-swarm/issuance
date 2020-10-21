import React, { ReactElement, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { formatUnits } from 'ethers/lib/utils';
import {
  CheckCircleTwoTone,
  DeleteTwoTone,
  DownOutlined,
  ExclamationCircleTwoTone,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Dropdown, Menu, Select, Space, Table, Tooltip } from 'antd';
import { ColumnType } from 'antd/lib/table';

import { ContributorFragment, ContributorStatus } from '@graphql';
import { BASE_CURRENCIES } from '@const';
import { useAppState, useDispatch, useEthers } from '@app';
import { FilterDropdown, EditableCell, AccountsAddModal } from '@components';
import { createPagination } from './listUtils';
import { Address } from '@components';

interface ContributorRecord {
  address: string;
  amount: number;
  name: string;
  note: string;
  createdAt: string;
}

type ContributorList = ContributorRecord[];

function tableColumns(columns: ColumnType<ContributorRecord>[]): ColumnType<ContributorRecord>[] {
  return columns.map((column) => ({ ...column, dataIndex: column.key }));
}

interface ManageContributorsProps {
  contributors: ContributorFragment[];
}

export function ManageContributors({ contributors }: ManageContributorsProps): ReactElement {
  const [paginate, setPaginate] = useState<boolean>(true);
  const [batchAdding, setBatchAdding] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { networkId } = useEthers();
  const [{ token }, dispatch] = useAppState();
  const { dispatchTransaction } = useDispatch();
  const client = useApolloClient();
  const baseCurrency = BASE_CURRENCIES.USDC;

  const statusFilterOptions = ['all', 'live', 'qualified', 'pending', 'deleted'];

  const handleSaveMeta = (address, prop, value) => {
    dispatch({ type: 'setAccountProp', list: 'contributors', address, prop, value, networkId });
  };

  const handleConfirm = (address) => {
    dispatchTransaction({
      method: 'contributorRestrictions.whitelistAccount',
      arguments: [address],
      description: 'Confirming contributor...',
      onSuccess: () => client.resetStore(),
    });
  };

  const handleRemove = (address) => {
    dispatchTransaction({
      method: 'contributorRestrictions.unWhitelistAccount',
      arguments: [address],
      description: 'Removing contributor...',
      onSuccess: () => client.resetStore(),
    });
  };

  const renderStatus = (status) => {
    let icon: ReactElement;
    switch (status) {
      case ContributorStatus.Pending:
        icon = <ExclamationCircleTwoTone twoToneColor="orange" />;
        break;
      case ContributorStatus.Qualified:
        icon = <CheckCircleTwoTone twoToneColor="green" />;
        break;
      case ContributorStatus.Removed:
      case ContributorStatus.Refunded:
        icon = <DeleteTwoTone twoToneColor="red" />;
        break;
    }
    return <Tooltip title={`${status} contribution`}>{icon}</Tooltip>;
  };

  const renderAction = (text, record: ContributorFragment) => {
    const enableConfirm = record.status === ContributorStatus.Pending;
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

  function filterContributor(contributor: ContributorFragment): boolean {
    const isPending = contributor.status === ContributorStatus.Pending;
    const isQualified = contributor.status === ContributorStatus.Qualified;
    const isRemoved = contributor.status === ContributorStatus.Removed;
    const isRefunded = contributor.status === ContributorStatus.Refunded;
    switch (statusFilter) {
      case 'all':
        return true;
      case 'live':
        return isQualified || isPending;
      case 'qualified':
        return isQualified;
      case 'pending':
        return isPending;
      case 'deleted':
        return isRemoved || isRefunded;
    }
  }

  const columns = tableColumns([
    {
      title: 'St.',
      key: 'status',
      render: renderStatus,
    },
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
      title: 'Amount',
      key: 'amount',
      align: 'right',
      render: (value) => formatUnits(value, baseCurrency.decimals),
    },
    {
      title: 'Name',
      key: 'name',
      className: 'editable-cell',
      render: (value, row) => (
        <EditableCell value={value} onChange={(value) => handleSaveMeta(row.address, 'name', value)} />
      ),
    },
    {
      title: 'Note',
      key: 'note',
      className: 'editable-cell',
      render: (value, row) => (
        <EditableCell value={value} onChange={(value) => handleSaveMeta(row.address, 'note', value)} />
      ),
    },
    {
      title: 'Do',
      key: 'action',
      render: renderAction,
      filterDropdown: <FilterDropdown onChange={(t) => console.log(t)} />,
      filterIcon: <SearchOutlined />,
      // onFilterDropdownVisibleChange: (visible) => visible && setTimeout(() => searchInput.current.select(), 100),
    },
  ]);

  const tableData: ContributorList = contributors
    .map((contributor) => {
      return {
        ...contributor,
        name: '',
        note: '',
        key: contributor.address,
        ...token.networks[networkId].contributors[contributor.address],
      };
    })
    .filter(filterContributor);

  console.log({ tableData });

  return (
    <>
      {tableData.length > 0 && (
        <div className="text-right mb-2">
          <Space>
            <Select
              onChange={(val) => setStatusFilter(val as string)}
              value={statusFilter}
              size="small"
              dropdownMatchSelectWidth={false}
              options={statusFilterOptions.map((x) => ({ label: x, value: x }))}
            />
            <Checkbox onChange={(e) => setPaginate(e.target.checked)} checked={paginate}>
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
          pagination={createPagination(!paginate, tableData.length)}
          rowClassName="editable-row"
        />
      </div>
      <div>
        <Button onClick={() => setBatchAdding(true)}>Batch add contributors</Button>
      </div>

      {batchAdding && <AccountsAddModal list="contributors" onClose={() => setBatchAdding(false)} />}
    </>
  );
}
