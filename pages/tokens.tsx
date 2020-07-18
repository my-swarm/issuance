import React, { useState } from 'react';
import { Table, Button, Drawer, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { dummyTokens as tokens } from '../dummy-data/dummy-tokens';
import { DefaultLayout } from '@components';
import Link from 'next/link';
import { Token, Uuid } from '../types';
import { TokenForm } from '../components/form';

enum EditMode {
  None,
  Add,
  Edit,
}

export default function Tokens() {
  const dataSource = tokens.map((token, key) => ({ key, ...token }));
  const columns = [
    {
      title: 'Token name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Token) => (
        <Space size="middle">
          <Button size="small" onClick={() => handleEdit(record.id)} icon={<EditOutlined />}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const [id, setId] = useState<Uuid>();
  const [editMode, setEditMode] = useState<EditMode>(EditMode.None);

  const getCurrentToken = () => {
    return tokens.find((token) => token.id === id);
  };

  const getEditTitle = () => {
    switch (editMode) {
      case EditMode.Add:
        return 'Create new token';
      case EditMode.Edit:
        const currentToken = getCurrentToken();
        return `Edit token '${currentToken ? currentToken.name : '??'}'`;
    }
  };

  const handleEdit = (id?: Uuid) => {
    setId(id);
    setEditMode(id ? EditMode.Edit : EditMode.Add);
  };

  const handleCancelEdit = () => {
    setId(undefined);
    setEditMode(EditMode.None);
  };

  const renderHeadExtra = () => (
    <Button key="1" type="primary" onClick={() => handleEdit()}>
      Add token
    </Button>
  );
  return (
    <DefaultLayout title="My Tokens" headExtra={renderHeadExtra()}>
      <Table columns={columns} dataSource={dataSource} />
      <Drawer
        title={getEditTitle()}
        visible={editMode !== EditMode.None}
        width="50%"
        closable={true}
        onClose={() => handleCancelEdit()}
      >
        <TokenForm onCancel={() => handleCancelEdit()} formData={getCurrentToken()} />
      </Drawer>
    </DefaultLayout>
  );
}
