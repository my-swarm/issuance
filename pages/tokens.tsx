import React, { useEffect, useState } from 'react';
import { Table, Button, Drawer, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, RocketOutlined } from '@ant-design/icons';

import { useStateValue } from '@app';
import { BaseError } from '@lib';
import { DefaultLayout, TokenForm, TokenDeploy } from '@components';
import { Token, Uuid, transferRestrictionsTypes, TokenState, tokenStates, DeployerState } from '@types';

enum EditMode {
  None,
  Add,
  Edit,
  Deploy,
  Manage,
}

export default function Tokens() {
  const columns = [
    {
      title: 'Token',
      key: 'name',
      render: (token) => `${token.name} (${token.symbol})`,
    },
    {
      title: 'Status',
      render: (token) => {
        const state = token.state || TokenState.Created;
        const deployerState = token.deployerState || DeployerState.None;
        return (
          <div>
            {tokenStates[state] || 'Unknown state'}
            {state === TokenState.Deploying && <div></div>}
          </div>
        );
      },
    },
    {
      title: 'Transfer restrictions',
      dataIndex: 'transferRestrictionsType',
      key: 'transferRestrictionsType',
      render: (type) => {
        return transferRestrictionsTypes[type];
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, token: Token) => (
        <Space size="small">
          <Button size="small" onClick={() => handleEdit(token.id)} icon={<EditOutlined />}>
            Edit
          </Button>
          <Button size="small" onClick={() => handleDeploy(token.id)} icon={<RocketOutlined />}>
            Deploy
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

  const dataSource = tokens.map((token: Token, key: number) => ({ key, ...token }));

  const getCurrentToken = () => {
    return tokens.find((token: Token) => token.id === id);
  };

  const getEditTitle = () => {
    const currentToken = getCurrentToken();

    if (editMode === EditMode.Add) {
      return 'Create new token';
    }
    if (editMode === EditMode.Edit) {
      return `Edit token '${currentToken ? currentToken.name : '??'}'`;
    }
    if (editMode === EditMode.Deploy) {
      return (
        <>
          Deploy{' '}
          <strong>
            {currentToken.name} ({currentToken.symbol})
          </strong>
        </>
      );
    }
  };

  const handleEdit = (id?: Uuid) => {
    setId(id);
    setEditMode(id ? EditMode.Edit : EditMode.Add);
  };

  const handleDeploy = (id: Uuid) => {
    setId(id);
    setEditMode(EditMode.Deploy);
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

  const handleDelete = (id: Uuid) => {
    dispatch({ type: 'deleteToken', id });
  };

  const renderHeadExtra = () => (
    <Button key="1" type="primary" onClick={() => handleEdit()}>
      Add token
    </Button>
  );

  return (
    <DefaultLayout title="My Tokens" headExtra={renderHeadExtra()} headTableAligned={true}>
      <Table columns={columns} dataSource={dataSource} />
      <Drawer
        title={getEditTitle()}
        visible={editMode !== EditMode.None}
        width="50%"
        closable={true}
        onClose={() => handleCancelEdit()}
      >
        {editMode === EditMode.Add || editMode === EditMode.Edit ? (
          <TokenForm onSubmit={handleSubmit} onCancel={() => handleCancelEdit()} formData={getCurrentToken()} />
        ) : editMode === EditMode.Deploy ? (
          <TokenDeploy id={getCurrentToken().id} />
        ) : null}
      </Drawer>
    </DefaultLayout>
  );
}
