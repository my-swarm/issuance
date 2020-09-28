import React, { useEffect, useState } from 'react';
import { Button, Drawer, Table } from 'antd';

import { useEthers, useAppState } from '@app';
import { BaseError } from '@lib';
import {
  DefaultLayout,
  TokenDeploy,
  TokenForm,
  TokenActions,
  TokenActionTitle,
  TokenStartFundraiser,
  TokenManage,
  TokenManageFundraiser,
  TokenStakeAndMint,
  TokenInfo,
} from '@components';
import { Token, TokenAction, TokenState, tokenStates, transferRules } from '@types';

export default function Tokens() {
  const { connected, networkId } = useEthers();
  const [token, setToken] = useState<Token>();
  const [action, setAction] = useState<TokenAction>();
  const [{ tokens }, dispatch] = useAppState();

  // reloads current token if tokens update
  useEffect(() => {
    if (token) {
      setToken(tokens.find((t) => t.id === token.id));
    }
  }, [tokens]);

  const columns = [
    {
      title: 'Token',
      key: 'name',
      render: (token) => `${token.name} (${token.symbol})`,
    },
    {
      title: 'Status',
      render: (token) => {
        if (!connected) {
          return <div>Unknown state (not connected)</div>;
        }
        const state = token.networks[networkId]?.state || TokenState.Created;
        return (
          <div>
            {tokenStates[state] || 'Unknown state'}
            {state === TokenState.Deploying && <div></div>}
          </div>
        );
      },
    },
    {
      title: 'Address',
      key: 'address',
      render: (token) => {
        return token.networks[networkId]?.addresses?.src20 || '-';
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

  const handleClearAction = () => {
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
    handleClearAction();
  };

  const handleDelete = (token) => {
    dispatch({ type: 'deleteToken', id: token.id });
  };

  const handleSwitchActionAnimated = (action: TokenAction) => {
    setAction(undefined);
    window.setTimeout(() => setAction(action), 200);
  };

  const renderHeadExtra = () => (
    <Button key="1" type="primary" onClick={() => handleCreate()}>
      Create token
    </Button>
  );

  function renderAction() {
    if (action === TokenAction.Create || action === TokenAction.Edit)
      return <TokenForm onSubmit={handleSubmit} onCancel={handleClearAction} formData={token} />;
    if (action === TokenAction.Deploy)
      return (
        <TokenDeploy
          token={token}
          onCancel={handleClearAction}
          onReview={() => handleSwitchActionAnimated(TokenAction.Edit)}
        />
      );
    if (action === TokenAction.StartFundraise)
      return <TokenStartFundraiser token={token} onClose={handleClearAction} />;
    if (action === TokenAction.ManageToken) return <TokenManage token={token} />;
    if (action === TokenAction.ManageFundraise) return <TokenManageFundraiser token={token} />;
    if (action === TokenAction.StakeAndMint) return <TokenStakeAndMint token={token} onCancel={handleClearAction} />;
    if (action === TokenAction.Info) return <TokenInfo token={token} />;
  }

  return (
    <DefaultLayout title="My Tokens" headExtra={renderHeadExtra()} headTableAligned={true}>
      <Table columns={columns} dataSource={dataSource} />
      <Drawer
        title={<TokenActionTitle token={token} action={action} />}
        visible={action !== undefined}
        width="50%"
        closable={true}
        onClose={() => handleClearAction()}
      >
        {renderAction()}
      </Drawer>
    </DefaultLayout>
  );
}
