import React, { ReactElement, useState } from 'react';
import { formatUnits } from 'ethers/lib/utils';
import {
  CheckCircleTwoTone,
  DeleteTwoTone,
  DownOutlined,
  ExclamationCircleTwoTone,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Dropdown, Menu, Select, Space, Table, Tooltip } from 'antd';

import { ContributorFragment, ContributorStatus } from '@graphql';
import { BASE_CURRENCIES } from '@const';
import { useAppState, useDispatch, useEthers, useGraphql } from '@app';
import { FilterDropdown, EditableCell, AccountsAddModal } from '@components';
import { createPagination, renderAddress, tableColumns } from './listUtils';
import { Address } from '@components';
import { strcmp } from '@lib';

interface TableRecord {
  address: string;
  amount: number;
  status: ContributorStatus;
  name: string;
  note: string;
}

interface ManageContributorsProps {
  contributors: ContributorFragment[];
}

export function ManageContributors({ contributors }: ManageContributorsProps): ReactElement {
  const { reset } = useGraphql();
  const [paginate, setPaginate] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');
  const { networkId } = useEthers();
  const [{ token }, dispatch] = useAppState();
  const { dispatchTransaction, setAccountProp } = useDispatch();
  const baseCurrency = BASE_CURRENCIES.USDC;

  const statusFilterOptions = ['all', 'live', 'qualified', 'pending', 'deleted'];

  const handleConfirm = (address) => {
    dispatchTransaction({
      method: 'contributorRestrictions.whitelistAccount',
      arguments: [address],
      description: 'Confirming contributor...',
      onSuccess: reset,
    });
  };

  const handleRemove = (address) => {
    dispatchTransaction({
      method: 'contributorRestrictions.unWhitelistAccount',
      arguments: [address],
      description: 'Removing contributor...',
      onSuccess: reset,
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
          <span className="cursor-pointer nowrap">
            action <DownOutlined />
          </span>
        </Dropdown>
      );
    } else {
      return null;
    }
  };

  function filterByStatus(record: TableRecord): boolean {
    const isPending = record.status === ContributorStatus.Pending;
    const isQualified = record.status === ContributorStatus.Qualified;
    const isRemoved = record.status === ContributorStatus.Removed;
    const isRefunded = record.status === ContributorStatus.Refunded;
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

  function filterByText(record: TableRecord): boolean {
    const text = searchText.toLowerCase();
    return `${record.address} ${record.name} ${record.note}`.toLowerCase().includes(text);
  }

  const columns = tableColumns<TableRecord>([
    {
      title: 'St.',
      key: 'status',
      render: renderStatus,
    },
    {
      title: 'Address',
      key: 'address',
      render: renderAddress,
      sorter: (a, b) => strcmp(a.address, b.address),
    },
    {
      title: 'Amount',
      key: 'amount',
      align: 'right',
      sorter: (a, b) => a.amount - b.amount,
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

  const tableData: TableRecord[] = contributors
    .map((contributor) => {
      const tokenAccountList = token.networks[networkId].accounts || {};
      return {
        ...contributor,
        key: contributor.address,
        amount: parseFloat(formatUnits(contributor.amount, baseCurrency.decimals)),
        ...tokenAccountList[contributor.address],
      };
    })
    .filter(filterByStatus)
    .filter(filterByText);

  return (
    <>
      {tableData.length > 0 && (
        <div className="text-right mb-2">
          <Space>
            <Select
              options={statusFilterOptions.map((x) => ({ label: x, value: x }))}
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as string)}
              size="small"
              dropdownMatchSelectWidth={false}
            />
            <Checkbox onChange={(e) => setPaginate(e.target.checked)} checked={paginate}>
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
          pagination={createPagination(!paginate, tableData.length)}
          rowClassName="editable-row"
        />
      </div>
    </>
  );
}
