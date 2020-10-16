import React, { ReactElement, useRef, useState } from 'react';
import ethers from 'ethers';
import moment from 'moment';
import { Button, Checkbox, Col, Input, Popconfirm, Row, Space, Table } from 'antd';
import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';

import { AccountList, AccountListRecord } from '@types';
import { useAppState, useContractAddress, useDispatch, useEthers } from '@app';
import { MANAGE_TABLE_PER_PAGE } from '@const';
import { Help, Loading } from '../utility';
import { GreylistedAccount, useWhitelistGreylistQuery, WhitelistedAccount } from '../../@graphql';

interface ManageAccountListProps {
  type: 'whitelist' | 'graylist';
}

interface AccountListRecord {
  address: string;
  name: string;
  note: string;
  createdAt: Date;
}

type RawAccountList = Array<{ address: string; createdAt: number }>;
type AccountList = AccountListRecord[];

export function ManageAccountList({ type }: ManageAccountListProps): ReactElement {
  const { address: myAddress, networkId } = useEthers();
  const [{ token }] = useAppState();
  const searchInput = useRef<Input>();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [newAddresses, setNewAddresses] = useState<string>('');
  const [showAll, setShowAll] = useState<boolean>(false);
  const [, dispatch] = useAppState();
  const { dispatchError, dispatchTransaction } = useDispatch();
  const { src20: src20Address } = useContractAddress();
  const { loading, error, data } = useWhitelistGreylistQuery({
    variables: { token: src20Address },
  });
  if (loading) return <Loading />;
  console.log({ data });

  const addMethod = type === 'whitelist' ? 'bulkWhitelistAccount' : 'bulkGreyListAccount';
  const removeMethod = type === 'whitelist' ? 'bulkUnWhitelistAccount' : 'bulkUnGreyListAccount';
  const rawAccounts: RawAccountList = type === 'whitelist' ? data.whitelistedAccounts : data.greylistedAccounts;
  console.log({ rawAccounts });
  const accounts: AccountList = rawAccounts.map((a) => {
    const tokenAccountList = token[type] || [];
    return {
      key: a.address, // for the table
      ...a,
      createdAt: moment(a.createdAt).toDate(),
      ...tokenAccountList.find((ta) => a.address === ta.address),
    };
  });

  const tableData: AccountList = accounts.filter((a) => a.address.toLowerCase().includes(searchText.toLowerCase()));

  const filterDropdown = (
    <div style={{ padding: 8 }}>
      <Space>
        <Input
          ref={searchInput}
          placeholder={`Search in account list`}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <CloseCircleOutlined onClick={() => setSearchText('')} />
      </Space>
    </div>
  );

  const handleToggleShowAll = (e) => {
    setShowAll(e.target.checked);
  };

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
      filterDropdown,
      filterIcon: <SearchOutlined />,
      onFilterDropdownVisibleChange: (visible) => visible && setTimeout(() => searchInput.current.select(), 100),
    },
  ];

  function parseAddressesInput(input: string): AccountList {
    let hadError = false;

    if (input.trim() === '') {
      dispatchError('Invalid input', 'Please provide an address list');
      return [];
    }

    const data: AccountList = input
      .trim()
      .split('\n')
      .map(
        (rawRecord): AccountListRecord => {
          const [uncheckedAddress, name, note] = rawRecord.split(/[,;\t]/).map((x) => x.trim());
          let address;

          try {
            address = ethers.utils.getAddress(uncheckedAddress);
          } catch (e) {
            hadError = true;
            dispatchError('Error parsing address list', `${e.reason}: ${uncheckedAddress}`);
          }
          return { address, name, note } as AccountListRecord;
        },
      );

    return hadError ? [] : data;
  }

  const handleBatchAdd = async (): Promise<void> => {
    const data = parseAddressesInput(newAddresses);
    if (data.length === 0) return;

    dispatchTransaction({
      method: `transferRules.${addMethod}`,
      arguments: [data.map((record) => record.address)],
      description: `Adding ${data.length} addresses to your ${type}`,
      onSuccess: () => handleAddToLocalState(data),
    });
  };

  const handleAddToLocalState = (accountList: AccountList) => {
    dispatch({
      type: 'addToTokenAccountList',
      id: token.id,
      listType: type,
      addItems: accountList,
    });
    setNewAddresses('');
  };

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

  function dispatchContractError(e: Error) {
    console.error(e);
    dispatchError('Error calling contract', e.message || null);
  }

  const rowSelection = {
    selectedRows,
    onChange: (rowKeys) => setSelectedRows(rowKeys),
  };

  const pagination = showAll
    ? {
        total: tableData.length,
        pageSize: tableData.length,
        hideOnSinglePage: true,
      }
    : {
        total: tableData.length,
        pageSize: MANAGE_TABLE_PER_PAGE,
        hideOnSinglePage: false,
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
            <Checkbox onChange={handleToggleShowAll}> show all</Checkbox>
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
          pagination={pagination}
        />
      </div>
      <h3>
        Batch add <Help name="batchAdd" />
      </h3>
      <div className="mb-2">
        <Input.TextArea value={newAddresses} onChange={(e) => setNewAddresses(e.target.value)}></Input.TextArea>
      </div>
      <Button onClick={handleBatchAdd} type="primary">
        Add addresses
      </Button>
    </>
  );
}
