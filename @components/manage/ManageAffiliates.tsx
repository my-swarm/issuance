import React, { ReactElement, useState } from 'react';
import { formatUnits } from 'ethers/lib/utils';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, Dropdown, Menu, Table } from 'antd';

import { AffiliateFragment } from '@graphql';
import { useAccountNotes, useAppState, useDispatch, useGraphql } from '@app';
import { Address, AffiliateEditModal, EditableCell, FilterDropdown } from '@components';
import { createPagination, renderAddress, tableColumns } from './listUtils';
import { parseUnits, strcmp } from '@lib';

interface TableRecord {
  address: string;
  referral: string;
  percentage: number;
  name: string;
  note: string;
}

interface ManageAffiliatesProps {
  affiliates: AffiliateFragment[];
}

export function ManageAffiliates({ affiliates }: ManageAffiliatesProps): ReactElement {
  const { reset } = useGraphql();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [affiliate, setAffiliate] = useState<AffiliateFragment>();
  const [paginate, setPaginate] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [{ onlineToken }] = useAppState();
  const accountNotes = useAccountNotes(onlineToken.address);
  const { dispatchTransaction, setAccountProp } = useDispatch();

  const handleEdit = (address?: string) => {
    if (address) {
      setAffiliate(affiliates.find((x) => x.address === address));
    } else {
      setAffiliate(undefined);
    }
    setIsEditing(true);
  };

  const handleFormSubmit = (values: AffiliateFragment) => {
    dispatchTransaction({
      method: 'affiliateManager.addOrUpdate',
      arguments: [values.address, values.referral, parseUnits(values.percentage, 4)],
      description: affiliate ? 'Updating affiliate' : 'Adding affiliate',
      onSuccess: () => {
        reset();
        setAffiliate(undefined);
        setIsEditing(false);
      },
    });
  };

  const handleRemove = (address) => {
    dispatchTransaction({
      method: 'affiliateManager.remove',
      arguments: [address],
      description: 'Removing affiliate...',
      onSuccess: reset,
    });
  };

  const renderAction = (text, record: TableRecord) => {
    const menu = (
      <Menu>
        <Menu.Item onClick={() => handleEdit(record.address)}>Edit</Menu.Item>
        <Menu.Item onClick={() => handleRemove(record.address)}>Remove</Menu.Item>
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

  function filterByText(record: TableRecord): boolean {
    const text = searchText.toLowerCase();
    return `${record.address} ${record.name} ${record.note}`.toLowerCase().includes(text);
  }

  const columns = tableColumns<TableRecord>([
    {
      title: 'Address',
      key: 'address',
      render: renderAddress,
      sorter: (a, b) => strcmp(a.address, b.address),
    },
    {
      title: 'Referral',
      key: 'referral',
      sorter: (a, b) => strcmp(a.referral, b.referral),
    },
    {
      title: 'Percent',
      key: 'percentage',
      align: 'right',
      sorter: (a, b) => a.percentage - b.percentage,
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

  const tableData: TableRecord[] = affiliates
    .map((affiliate) => {
      return {
        ...affiliate,
        key: affiliate.address,
        percentage: parseFloat(formatUnits(affiliate.percentage, 4)),
        ...accountNotes[affiliate.address],
      };
    })
    .filter(filterByText);

  return (
    <>
      {tableData.length > 0 && (
        <div className="text-right mb-2">
          <Checkbox onChange={(e) => setPaginate(e.target.checked)} checked={paginate}>
            paginate
          </Checkbox>
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
      <div>
        <Button onClick={() => handleEdit()}>Add new affiliate</Button>
      </div>
      {isEditing && (
        <AffiliateEditModal affiliate={affiliate} onClose={() => setIsEditing(false)} onSubmit={handleFormSubmit} />
      )}
    </>
  );
}
