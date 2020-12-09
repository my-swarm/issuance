import React, { ReactElement, useState } from 'react';
import { Checkbox, Dropdown, Menu, Select, Space, Table, Tooltip } from 'antd';
import {
  CheckCircleTwoTone,
  DeleteTwoTone,
  DownOutlined,
  ExclamationCircleTwoTone,
  SearchOutlined,
} from '@ant-design/icons';

import { useAppState, useDispatch, useGraphql, useAccountNotes } from '@app';
import { TransferRequestStatus, useTransferRequestsQuery } from '@graphql';
import { FilterDropdown, Loading } from '@components';
import { createPagination, renderAddress, tableColumns } from './listUtils';
import { AccountMeta, formatDatetime, strcmp } from '@lib';
import { formatUnits } from 'ethers/lib/utils';

interface TableRecord {
  requestId: number;
  from: string;
  to: string;
  value: number;
  status: TransferRequestStatus;
  createdAt: number; // just keep it as unix timestamp and format on render
  metaFrom: AccountMeta;
  metaTo: AccountMeta;
}

export function ManageTransferRequests(): ReactElement {
  const { reset } = useGraphql();
  const [{ onlineToken }] = useAppState();
  const accountNotes = useAccountNotes(onlineToken.address);
  const [searchText, setSearchText] = useState<string>('');
  const [paginate, setPaginate] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { dispatchTransaction, setAccountProp } = useDispatch();
  const { loading, error, data } = useTransferRequestsQuery({
    variables: { token: onlineToken.id },
  });
  if (loading || !data) return <Loading />;
  const { token } = data;
  const { transferRequests } = token;

  const statusFilterOptions = [
    'all',
    TransferRequestStatus.Pending,
    TransferRequestStatus.Approved,
    TransferRequestStatus.Denied,
  ];

  const handleApprove = (record: TableRecord) => {
    dispatchTransaction({
      method: 'transferRules.approveTransfer',
      arguments: [record.requestId],
      description: `Approving transfer from ${record.from} to ${record.to}`,
      onSuccess: reset,
    });
  };

  const handleDeny = (record: TableRecord) => {
    dispatchTransaction({
      method: 'transferRules.denyTransfer',
      arguments: [record.requestId],
      description: `Approving transfer from ${record.from} to ${record.to}`,
      onSuccess: reset,
    });
  };

  const tableData: TableRecord[] = transferRequests
    .map((a) => {
      return {
        ...a,
        from: a.from.address,
        to: a.to.address,
        key: a.requestId, // for the table
        value: parseFloat(formatUnits(a.value, token.decimals)),
        metaFrom: accountNotes[a.from.address],
        metaTo: accountNotes[a.from.address],
      };
    })
    .filter((a) => `${a.from} ${a.to}`.toLowerCase().includes(searchText.toLowerCase()))
    .filter((a) => statusFilter === 'all' || a.status === statusFilter);

  const renderStatus = (status) => {
    let icon: ReactElement;
    switch (status) {
      case TransferRequestStatus.Pending:
        icon = <ExclamationCircleTwoTone twoToneColor="orange" />;
        break;
      case TransferRequestStatus.Approved:
        icon = <CheckCircleTwoTone twoToneColor="green" />;
        break;
      case TransferRequestStatus.Denied:
        icon = <DeleteTwoTone twoToneColor="red" />;
        break;
    }
    return <Tooltip title={`${status} transfer request`}>{icon}</Tooltip>;
  };

  const renderAction = (value: any, record: TableRecord) => {
    if (record.status !== TransferRequestStatus.Pending) return null;

    const menu = (
      <Menu>
        <Menu.Item onClick={() => handleApprove(record)}>Approve transfer</Menu.Item>
        <Menu.Item onClick={() => handleDeny(record)}>Deny transfer</Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <span className="cursor-pointer nowrap">
          action <DownOutlined />
        </span>
      </Dropdown>
    );
  };

  const columns = tableColumns<TableRecord>([
    {
      title: 'St.',
      key: 'status',
      render: renderStatus,
    },
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
            <Select
              options={statusFilterOptions.map((x) => ({ label: x, value: x }))}
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as string)}
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
