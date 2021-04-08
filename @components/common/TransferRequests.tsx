import React, { ReactElement, useState } from 'react';
import { Checkbox, Dropdown, Menu, Select, Space, Table, Tooltip } from 'antd';

import { useAccountNotes } from '@app';
import { TokenInfoFragment, TransferRequestFragment, TransferRequestStatus } from '@graphql';
import { FilterDropdown, TransferDirection } from '@components';
import { createPagination, renderAddress, tableColumns } from '../manage/listUtils';
import { AccountMeta, formatDatetime, formatUnits, strcmp } from '@lib';
import { CheckCircleTwoTone, DeleteTwoTone, DownOutlined, ExclamationCircleTwoTone, SearchOutlined } from '@lib/icons';

export interface TransferRequestRecord {
  requestId: number;
  from: string;
  to: string;
  value: number;
  status: TransferRequestStatus;
  createdAt: number; // just keep it as unix timestamp and format on render
  metaFrom: AccountMeta;
  metaTo: AccountMeta;
}

interface Props {
  token: TokenInfoFragment;
  transferRequests: TransferRequestFragment[];
  approved?: boolean;
  defaultPaginate?: boolean | 'off';
  defaultStatus?: TransferRequestStatus | 'all';
  myAddress?: string;
  onApprove?: (record: TransferRequestRecord) => void;
  onDeny?: (record: TransferRequestRecord) => void;
}

export function TransferRequests({
  token,
  transferRequests,
  approved = false,
  defaultPaginate = true,
  myAddress,
  defaultStatus = 'all',
  onApprove,
  onDeny,
}: Props): ReactElement {
  const accountNotes = useAccountNotes(token.address);
  const [searchText, setSearchText] = useState<string>('');
  const [paginate, setPaginate] = useState<boolean>(defaultPaginate === true);
  const [statusFilter, setStatusFilter] = useState<string>(defaultStatus);
  const hasActions = onApprove || onDeny;

  const statusFilterOptions = [
    'all',
    TransferRequestStatus.Pending,
    ...(approved ? [TransferRequestStatus.Approved] : []),
    TransferRequestStatus.Denied,
  ];

  const tableData: TransferRequestRecord[] = transferRequests
    .map((a) => {
      return {
        ...a,
        from: a.fromAddress,
        to: a.toAddress,
        key: a.requestId, // for the table
        value: parseFloat(formatUnits(a.value, token.decimals)),
        metaFrom: accountNotes[a.fromAddress],
        metaTo: accountNotes[a.fromAddress],
      };
    })
    .filter((a) => `${a.from} ${a.to}`.toLowerCase().includes(searchText.toLowerCase()))
    .filter((a) => statusFilter === 'all' || a.status === statusFilter)
    .sort((a, b) => b.createdAt - a.createdAt);

  const renderStatus = (status, row) => {
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
    return (
      <Space size="small">
        <Tooltip title={`${status} transfer request`}>{icon}</Tooltip>
        {myAddress && <TransferDirection myAddress={myAddress} toAddress={row.toAddress} />}
      </Space>
    );
  };

  const renderAction = (value: any, record: TransferRequestRecord) => {
    if (record.status !== TransferRequestStatus.Pending) return null;

    const menu = (
      <Menu>
        {onApprove && <Menu.Item onClick={() => onApprove && onApprove(record)}>Approve transfer</Menu.Item>}
        {onDeny && <Menu.Item onClick={() => onDeny && onDeny(record)}>Deny transfer</Menu.Item>}
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

  const columns = tableColumns<TransferRequestRecord>([
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
  ]);
  if (hasActions) {
    columns.push({
      title: 'Do',
      key: 'action',
      render: renderAction,
      filterDropdown: <FilterDropdown onChange={(t) => setSearchText(t)} />,
      filterIcon: <SearchOutlined />,
    });
  }

  return (
    <>
      {transferRequests.length > 0 && (
        <div className="text-right mb-2">
          <Space>
            <Select
              options={statusFilterOptions.map((x) => ({ label: x, value: x }))}
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as string)}
              size="small"
              dropdownMatchSelectWidth={false}
            />
            {defaultPaginate !== 'off' && (
              <Checkbox onChange={(e) => setPaginate(e.target.checked)} checked={paginate}>
                {' '}
                paginate
              </Checkbox>
            )}
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
