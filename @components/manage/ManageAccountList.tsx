import React, { ReactElement, useState } from 'react';
import moment from 'moment';
import { Button, Checkbox, Col, Popconfirm, Row, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { useAppState, useContractAddress, useDispatch, useEthers } from '@app';
import { useWhitelistGreylistQuery } from '@graphql';
import { Loading, FilterDropdown, AccountsAddModal } from '@components';
import { createPagination } from './listUtils';

interface ManageAccountListProps {
  type: 'whitelist' | 'greylist';
}

interface AccountRecord {
  address: string;
  name: string;
  note: string;
  createdAt: Date;
}

type RawAccount = { address: string; createdAt: number };
type RawAccountList = RawAccount[];
type AccountList = AccountRecord[];

export function ManageAccountList({ type }: ManageAccountListProps): ReactElement {
  const [{ token }] = useAppState();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [paginate, setPaginate] = useState<boolean>(false);
  const [batchAdding, setBatchAdding] = useState<boolean>(false);
  const [, dispatch] = useAppState();
  const { networkId } = useEthers();
  const { dispatchTransaction } = useDispatch();
  const { src20: src20Address } = useContractAddress();
  const { loading, error, data } = useWhitelistGreylistQuery({
    variables: { token: src20Address },
  });
  if (loading) return <Loading />;

  const removeMethod = type === 'whitelist' ? 'bulkUnWhitelistAccount' : 'bulkUnGreyListAccount';
  const rawAccounts: RawAccountList = type === 'whitelist' ? data.whitelistedAccounts : data.greylistedAccounts;
  const accounts: AccountList = rawAccounts.map((a) => {
    const tokenAccountList = token.networks[networkId][type] || {};
    return {
      key: a.address, // for the table
      ...a,
      createdAt: moment(a.createdAt).toDate(),
      ...tokenAccountList[a.address],
    };
  });

  const tableData: AccountList = accounts.filter((a) => a.address.toLowerCase().includes(searchText.toLowerCase()));

  const columns = [
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      filterDropdown: <FilterDropdown onChange={(t) => setSearchText(t)} />,
      filterIcon: <SearchOutlined />,
      // onFilterDropdownVisibleChange: (visible) => visible && setTimeout(() => searchInput.current.select(), 100),
    },
  ];

  const handleBatchDelete = async (): Promise<void> => {
    const addressList = selectedRows;
    if (addressList.length === 0) return;

    dispatchTransaction({
      method: `transferRules.${removeMethod}`,
      arguments: [addressList],
      description: `Removing ${addressList.length} addresses from your ${type}`,
      onSuccess: () => handleDeleteFromLocalState(addressList),
    });
  };

  const handleDeleteFromLocalState = (addressList: string[]) => {
    dispatch({
      type: 'deleteFromTokenAccountList',
      id: token.id,
      listType: type,
      deleteItems: addressList,
    });
    setSelectedRows([]);
  };

  const rowSelection = {
    selectedRows,
    onChange: (rowKeys) => setSelectedRows(rowKeys),
  };

  return (
    <>
      {tableData.length > 0 && (
        <Row className="mb-3">
          <Col span={12}>
            <Popconfirm
              disabled={selectedRows.length === 0}
              key="delete"
              title={`Are you sure you want to remove ${selectedRows.length} accounts from your ${type}?`}
              onConfirm={handleBatchDelete}
            >
              <Button size="small" disabled={selectedRows.length === 0}>
                Delete selected
              </Button>
            </Popconfirm>
          </Col>
          <Col span={12} className="text-right">
            <Checkbox onChange={(e) => setPaginate(e.target.checked)}> show all</Checkbox>
          </Col>
        </Row>
      )}

      <div style={{ maxHeight: '40rem', overflowY: 'auto' }}>
        <Table
          size="small"
          columns={columns}
          dataSource={tableData}
          rowSelection={rowSelection}
          className="mb-3"
          pagination={createPagination(!paginate, tableData.length)}
        />
      </div>
      <div>
        <Button onClick={() => setBatchAdding(true)}>Batch add accounts</Button>
      </div>

      {batchAdding && <AccountsAddModal list={type} onClose={() => setBatchAdding(false)} />}
    </>
  );
}
