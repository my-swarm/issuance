import React, { ReactElement, useState } from 'react';
import { Checkbox, Dropdown, Menu, Space, Table, Tooltip } from 'antd';
import { CheckCircleTwoTone, DownOutlined, ExclamationCircleTwoTone, SearchOutlined } from '@ant-design/icons';

import { useAppState, useContractAddress, useDispatch, useEthers, useGraphql } from '@app';
import { useTokenHoldersQuery } from '@graphql';
import { AccountBurnModal, Address, EditableCell, FilterDropdown, Loading } from '@components';
import { createPagination, renderAddress, tableColumns } from './listUtils';
import { ColumnType } from 'antd/lib/table';
import { formatDatetime, strcmp } from '@lib';
import { formatUnits } from 'ethers/lib/utils';

interface TableRecord {
  address: string;
  name: string;
  note: string;
  balance: number;
  isFrozen: boolean;
  createdAt: number; // just keep it as unix timestamp and format on render
}

export function ManageTokenHolders(): ReactElement {
  const { reset } = useGraphql();
  const [{ token }] = useAppState();
  const [searchText, setSearchText] = useState<string>('');
  const [paginate, setPaginate] = useState<boolean>(true);
  const [burningAccount, setBurningAccount] = useState<string>();
  const { networkId } = useEthers();
  const { dispatchTransaction, setAccountProp } = useDispatch();
  const { src20: src20Address } = useContractAddress();
  const { loading, error, data } = useTokenHoldersQuery({
    variables: { token: src20Address },
  });
  if (loading || !data) return <Loading />;
  const { features, holders } = data.token;

  const handleFreeze = (account: string) => {
    dispatchTransaction({
      method: 'features.freezeAccount',
      arguments: [account],
      description: `Freezing account ${account}`,
      onSuccess: reset,
    });
  };

  const handleUnfreeze = (account: string) => {
    dispatchTransaction({
      method: 'features.unfreezeAccount',
      arguments: [account],
      description: `Unfreezing account ${account}`,
      onSuccess: reset,
    });
  };

  const handleBurnedAccount = () => {
    setBurningAccount(undefined);
    reset();
  };

  const tableData: TableRecord[] = holders
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

  const renderStatus = (isFrozen: boolean) => {
    let icon: ReactElement;
    let title: string;
    if (isFrozen) {
      icon = <ExclamationCircleTwoTone twoToneColor="red" />;
      title = 'Frozen account';
    } else {
      icon = <CheckCircleTwoTone twoToneColor="green" />;
      title = 'Active account';
    }
    return <Tooltip title={title}>{icon}</Tooltip>;
  };

  const renderAction = (value: any, record: TableRecord) => {
    const enableFreeze = features.accountFreeze && !record.isFrozen;
    const enableUnfreeze = features.accountFreeze && record.isFrozen;
    const enableBurn = features.accountBurn && record.balance > 0;
    if (enableFreeze || enableUnfreeze || enableBurn) {
      const menu = (
        <Menu>
          {enableFreeze && <Menu.Item onClick={() => handleFreeze(record.address)}>Freeze account</Menu.Item>}
          {enableUnfreeze && <Menu.Item onClick={() => handleUnfreeze(record.address)}>Unfreeze account</Menu.Item>}
          {enableBurn && <Menu.Item onClick={() => setBurningAccount(record.address)}>Burn tokens</Menu.Item>}
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

  const columns = tableColumns<TableRecord>([
    {
      title: 'St.',
      key: 'isFrozen',
      render: renderStatus,
    },
    {
      title: 'Address',
      key: 'address',
      render: renderAddress,
      sorter: (a, b) => strcmp(a.address, b.address),
    },
    {
      title: 'First transaction',
      key: 'createdAt',
      render: formatDatetime,
      sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
      title: 'Balance',
      key: 'balance',
      align: 'right',
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: 'Name',
      key: 'name',
      className: 'editable-cell',
      render: (value, row) => (
        <EditableCell value={value} onChange={(value) => setAccountProp(row.address, 'name', value)} />
      ),
      sorter: (a, b) => strcmp(a.name, b.name),
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

      {burningAccount !== undefined && (
        <AccountBurnModal
          address={burningAccount}
          currentBalance={tableData.find((x) => x.address === burningAccount).balance}
          onClose={handleBurnedAccount}
        />
      )}
    </>
  );
}
