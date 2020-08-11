import React, { useState } from 'react';
import { Button, Drawer, Table } from 'antd';

import { useStateValue } from '@app';
import { BaseError } from '@lib';
import {
  DefaultLayout,
  TokenDeploy,
  TokenForm,
  TokenActions,
  TokenActionTitle,
  TokenStartFundraise,
  TokenManage,
  TokenManageFundraise,
  TokenStakeAndMint,
  FundraiserForm,
} from '@components';
import { Token, TokenAction, TokenState, tokenStates, transferRestrictionsTypes } from '@types';

export default function Tokens() {
  const [token, setToken] = useState<Token>();
  const [action, setAction] = useState<TokenAction>();
  const [{ tokens }, dispatch] = useStateValue();

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
      render: (token: Token) => <TokenActions token={token} onAction={(action) => handleAction(action, token)} />,
    },
  ];

  const dataSource = tokens.map((token: Token, key: number) => ({ key, ...token }));

  const handleAction = (action: TokenAction, token: Token) => {
    if (action === TokenAction.Delete) {
      handleDelete(token);
    } else {
      setToken(token);
      setAction(action);
    }
  };

  const handleCreate = () => {
    setToken(undefined);
    setAction(TokenAction.Create);
  };

  const handleCancelEdit = () => {
    setToken(undefined);
    setAction(undefined);
  };

  const handleSubmit = (newToken: Token) => {
    switch (action) {
      case TokenAction.Create:
        dispatch({ type: 'addToken', token: newToken });
        break;
      case TokenAction.Edit:
        dispatch({ type: 'updateToken', token: { id: token.id, ...newToken } });
        break;
      default:
        throw new BaseError('Cannot submit when not editing');
    }
    handleCancelEdit();
  };

  const handleDelete = (token) => {
    dispatch({ type: 'deleteToken', id: token.id });
  };

  const renderHeadExtra = () => (
    <Button key="1" type="primary" onClick={() => handleCreate()}>
      Create token
    </Button>
  );

  function renderAction() {
    if (action === TokenAction.Create || action === TokenAction.Edit)
      return <TokenForm onSubmit={handleSubmit} onCancel={handleCancelEdit} formData={token} />;
    if (action === TokenAction.Deploy) return <TokenDeploy token={token} />;
    if (action === TokenAction.StartFundraise)
      return <FundraiserForm onCancel={handleCancelEdit} onSubmit={() => console.log('submit')} />;
    if (action === TokenAction.ManageToken) return <TokenManage token={token} />;
    if (action === TokenAction.ManageFundraise) return <TokenManageFundraise token={token} />;
    if (action === TokenAction.StakeAndMint) return <TokenStakeAndMint token={token} />;
  }

  return (
    <DefaultLayout title="My Tokens" headExtra={renderHeadExtra()} headTableAligned={true}>
      <Table columns={columns} dataSource={dataSource} />
      <Drawer
        title={<TokenActionTitle token={token} action={action} />}
        visible={action !== undefined}
        width="50%"
        closable={true}
        onClose={() => handleCancelEdit()}
      >
        {renderAction()}
      </Drawer>
    </DefaultLayout>
  );
}
