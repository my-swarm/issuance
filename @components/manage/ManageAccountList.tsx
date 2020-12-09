import React, { ReactElement, useState } from 'react';
import moment from 'moment';
import { Button, Checkbox, Col, Popconfirm, Row, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { Account, AccountList, RawAccountList } from '@lib';
import { useAppState, useDispatch, useEthers, useGraphql, useAccountNotes } from '@app';
import { useWhitelistGreylistQuery } from '@graphql';
import { AccountsAddModal, Address, EditableCell, FilterDropdown, Loading } from '@components';
import { createPagination, renderAddress, tableColumns } from './listUtils';

interface ManageAccountListProps {
  type: 'whitelist' | 'greylist';
}

export function ManageAccountList({ type }: ManageAccountListProps): ReactElement {
  const { reset } = useGraphql();
  const [{ onlineToken }] = useAppState();
  const accountNotes = useAccountNotes(onlineToken.address);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [paginate, setPaginate] = useState<boolean>(true);
  const [batchAdding, setBatchAdding] = useState<boolean>(false);
  const { dispatchTransaction, setAccountProp } = useDispatch();
  const { loading, error, data } = useWhitelistGreylistQuery({
    variables: { token: onlineToken.id },
  });
  if (loading) return <Loading />;

  const handleBatchDelete = async (): Promise<void> => {
    const addressList = selectedRows;
    if (addressList.length === 0) return;

    dispatchTransaction({
      method: `transferRules.${removeMethod}`,
      arguments: [addressList],
      description: `Removing ${addressList.length} addresses from your ${type}`,
      onSuccess: reset,
    });
  };

  const handleAddModalClosed = () => {
    setBatchAdding(false);
    reset();
  };

  const removeMethod = type === 'whitelist' ? 'bulkUnWhitelistAccount' : 'bulkUnGreyListAccount';
  const rawAccounts: RawAccountList = type === 'whitelist' ? data.whitelistedAccounts : data.greylistedAccounts;
  const tableData: AccountList = rawAccounts
    .map((a) => {
      return {
        key: a.address, // for the table
        ...a,
        createdAt: moment(a.createdAt).toDate(),
        ...accountNotes[a.address],
      };
    })
    .filter((a) => `${a.address} ${a.name} ${a.note}`.toLowerCase().includes(searchText.toLowerCase()));

  const columns = tableColumns<Account>([
    {
      title: 'Address',
      key: 'address',
      render: renderAddress,
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
      filterDropdown: <FilterDropdown onChange={(t) => setSearchText(t)} />,
      filterIcon: <SearchOutlined />,
      // onFilterDropdownVisibleChange: (visible) => visible && setTimeout(() => searchInput.current.select(), 100),
    },
  ]);

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
            <Checkbox onChange={(e) => setPaginate(e.target.checked)} checked={paginate}>
              {' '}
              paginate
            </Checkbox>
          </Col>
        </Row>
      )}

      <div className="limit-height">
        <Table
          size="small"
          columns={columns}
          dataSource={tableData}
          rowSelection={rowSelection}
          className="mb-3"
          rowClassName="editable-row"
          pagination={createPagination(!paginate, tableData.length)}
        />
      </div>
      <div>
        <Button onClick={() => setBatchAdding(true)}>Batch add accounts</Button>
      </div>

      {batchAdding && <AccountsAddModal list={type} onClose={handleAddModalClosed} />}
    </>
  );
}
