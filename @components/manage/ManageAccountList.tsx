import React, { ReactElement, useEffect, useRef, useState } from 'react';
import ethers from 'ethers';
import { Button, Table, Input, Space, Checkbox, Row, Col, Popconfirm } from 'antd';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { AccountList, AccountListRecord, Token, TokenAction } from '@types';
import { useContract, useEthers, useStateValue } from '@app';
import { MANAGE_TABLE_PER_PAGE } from '@const';
import { Help } from '../utility';

interface ManageAccountListProps {
  token: Token;
  type: 'whitelist' | 'graylist';
}

export function ManageAccountList({ token, type }: ManageAccountListProps): ReactElement {
  const { address: myAddress } = useEthers();
  const searchInput = useRef<Input>();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [newAddresses, setNewAddresses] = useState<string>('');
  const [showAll, setShowAll] = useState<boolean>(false);
  const [, dispatch] = useStateValue();
  const transferRules = useContract('transferRules', token);

  const accounts = token[type] || [];
  console.log('render account lsit', token);

  const tableData = accounts
    .filter((a) => a.address.toLowerCase().includes(searchText.toLowerCase()))
    .map((account) => ({
      key: account.address,
      ...account,
    }));

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

  const handleBatchAdd = (): void => {
    let hadError = false;

    const data: AccountList = newAddresses
      .trim()
      .split('\n')
      .map(
        (rawRecord): AccountListRecord => {
          console.log({ rawRecord });
          const [uncheckedAddress, name, note] = rawRecord.split(/[,;\t]/).map((x) => x.trim());
          let address;

          try {
            address = ethers.utils.getAddress(uncheckedAddress);
          } catch (e) {
            hadError = true;
            dispatch({
              type: 'showError',
              error: {
                message: 'Error parsing address list',
                description: `${e.reason}: ${uncheckedAddress}`,
              },
            });
          }

          return { address, name, note } as AccountListRecord;
        },
      );

    if (!hadError) {
      dispatch({
        type: 'addToTokenAccountList',
        id: token.id,
        listType: type,
        addItems: data,
      });
      setNewAddresses('');
    }
  };

  const handleBatchDelete = () => {
    dispatch({
      type: 'deleteFromTokenAccountList',
      id: token.id,
      listType: type,
      deleteItems: selectedRows,
    });
  };

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
