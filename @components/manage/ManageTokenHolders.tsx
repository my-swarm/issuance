import React, { ReactElement, useState } from 'react';
import { Button, Checkbox, Divider, Dropdown, Menu, Space, Table, Tooltip } from 'antd';
import { CheckCircleTwoTone, DownOutlined, ExclamationCircleTwoTone, SearchOutlined } from '@lib/icons';

import { useAppState, useDispatch, useAccountNotes, useEthers } from '@app';
import { useTokenHoldersQuery } from '@graphql';
import {
  AccountBurnModal,
  AccountsAddModal,
  AccountsBurnModal,
  Address,
  EditableCell,
  FilterDropdown,
  Loading,
  TransferModal,
} from '@components';
import { createPagination, renderAddress, tableColumns } from './listUtils';
import { formatUnits, formatDatetime, strcmp, tokenBalance, tokenAutoburned } from '@lib';
import { AddressZero } from '@ethersproject/constants';

interface TableRecord {
  address: string;
  name: string;
  note: string;
  balance: number;
  isFrozen: boolean;
  createdAt: number; // just keep it as unix timestamp and format on render
}

export function ManageTokenHolders(): ReactElement {
  const { block } = useEthers();
  const [{ onlineToken }] = useAppState();
  const { dispatchTransaction, setAccountProp } = useDispatch();
  const accountNotes = useAccountNotes(onlineToken.address);
  const [searchText, setSearchText] = useState<string>('');
  const [paginate, setPaginate] = useState<boolean>(true);
  const [transferingFrom, setTransferingFrom] = useState<string>();
  const [burningAccount, setBurningAccount] = useState<string>();
  const [massBurning, setMassBurning] = useState<boolean>(false);
  const { loading, refetch, data } = useTokenHoldersQuery({
    variables: { token: onlineToken.id },
  });
  if (loading) return <Loading />;
  const { token } = data;
  const { features, holders } = token;

  const handleFreeze = (account: string) => {
    dispatchTransaction({
      method: 'features.freezeAccount',
      args: [account],
      description: `Freezing account ${account}`,
      syncCallbacks: [refetch],
    });
  };

  const handleUnfreeze = (account: string) => {
    dispatchTransaction({
      method: 'features.unfreezeAccount',
      args: [account],
      description: `Unfreezing account ${account}`,
      syncCallbacks: [refetch],
    });
  };

  const handleCloseModal = () => {
    setBurningAccount(undefined);
    setTransferingFrom(undefined);
  };

  const tableData: TableRecord[] = holders
    .filter((holder) => holder.address !== AddressZero)
    .map((a) => {
      return {
        ...a,
        key: a.address, // for the table
        balance: parseFloat(formatUnits(tokenBalance(block, token, a.balance), token.decimals)),
        ...accountNotes[a.address],
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
    const isAutoburned = tokenAutoburned(block, token);
    const enableFreeze = features.accountFreeze && !record.isFrozen;
    const enableUnfreeze = features.accountFreeze && record.isFrozen;
    const enableBurn = features.accountBurn && record.balance > 0;
    const enableTransfer = features.forceTransfer && record.balance > 0;
    if (!isAutoburned && (enableFreeze || enableUnfreeze || enableBurn || enableTransfer)) {
      const menu = (
        <Menu>
          {enableTransfer && <Menu.Item onClick={() => setTransferingFrom(record.address)}>Transfer tokens</Menu.Item>}
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

      <Divider />
      <div>
        <Button onClick={() => setMassBurning(true)}>Mass burn accounts</Button>
      </div>

      {burningAccount !== undefined && (
        <AccountBurnModal
          token={token}
          address={burningAccount}
          currentBalance={tableData.find((x) => x.address === burningAccount).balance}
          onClose={handleCloseModal}
          refetch={refetch}
        />
      )}
      {massBurning && <AccountsBurnModal onClose={() => setMassBurning(false)} refetch={refetch} />}
      {transferingFrom !== undefined && (
        <TransferModal
          token={token}
          from={transferingFrom}
          currentBalance={tableData.find((x) => x.address === transferingFrom).balance}
          onClose={handleCloseModal}
          refetch={refetch}
        />
      )}
    </>
  );
}
