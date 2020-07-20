import React, { useEffect, useState } from 'react';
import { Table, Button, Drawer, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DefaultLayout } from '@components';
import { Token, Uuid } from '@types';
import { TokenForm } from '@components';
import { useStateValue } from '@app';
import BaseError from '../lib/BaseError';
import { transferRestrictionsTypes } from '../types';

enum EditMode {
  None,
  Add,
  Edit,
}

export default function Tokens() {
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
      title: 'Transfer restrictions',
      dataIndex: 'transferRestrictionsType',
      key: 'transferRestrictionsType',
      render: (text: string, token: Token) => {
        return transferRestrictionsTypes[token.transferRestrictionsType];
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, token: Token) => (
        <Space size="middle">
          <Button size="small" onClick={() => handleEdit(token.id)} icon={<EditOutlined />}>
            Edit
          </Button>
          <Popconfirm title={`Are you sure you want to delete '${token.name}`} onConfirm={() => handleDelete(token.id)}>
            <Button size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [id, setId] = useState<Uuid>();
  const [editMode, setEditMode] = useState<EditMode>(EditMode.None);
  const [state, dispatch] = useStateValue();
  const { tokens } = state;

  const dataSource = tokens.map((token, key) => ({ key, ...token }));

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

  const handleSubmit = (token: Token) => {
    switch (editMode) {
      case EditMode.Add:
        dispatch({ type: 'addToken', token });
        break;
      case EditMode.Edit:
        dispatch({ type: 'updateToken', token: { ...token, id } });
        break;
      default:
        throw new BaseError('Cannot submit when not editing');
    }
    handleCancelEdit();
  };

  const handleDelete = (id: number) => {
    dispatch({ type: 'deleteToken', id });
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
        <TokenForm onSubmit={handleSubmit} onCancel={() => handleCancelEdit()} formData={getCurrentToken()} />
      </Drawer>
    </DefaultLayout>
  );
}
