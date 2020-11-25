import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Drawer, Table } from 'antd';

import { useEthers, useAppState, useDispatch, useGraphql } from '@app';
import { BaseError, parseUnits, sameAddress } from '@lib';
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
  Address,
  Loading,
} from '@components';
import { Token, TokenAction, TokenRecord, TokenState, tokenStates, transferRules } from '@types';
import { useTokensQuery, TokenInfoFragment } from '@graphql';
import { renderAddress, tableColumns } from '../@components/manage/listUtils';
import { SWM_TOKEN_DECIMALS } from '@const';

function getTokenList(localTokens: Token[], onlineTokens: TokenInfoFragment[], networkId): TokenRecord[] {
  if (!networkId) return [];

  const result: TokenRecord[] = localTokens.map((localToken) => ({
    id: localToken.id,
    name: localToken.name,
    symbol: localToken.symbol,
    address: localToken.networks[networkId]?.addresses.src20 || undefined,
    localState: localToken.networks[networkId]?.state || TokenState.Created,
    isDeployed: false,
    isMinted: false,
    isFundraising: false,
    localToken,
  }));

  for (const onlineToken of onlineTokens) {
    const fundraiserStatus = onlineToken?.currentFundraiser?.status;
    const token = {
      // name: onlineToken.name,
      // symbol: onlineToken.symbol,
      // address: onlineToken.address,
      isFundraising: fundraiserStatus !== undefined,
      isMinted: parseUnits(onlineToken.stake, SWM_TOKEN_DECIMALS).gt(0),
      isDeployed: true,
    };
    const index = result.findIndex((t) => sameAddress(t.address, onlineToken.address));
    if (index !== -1) {
      result[index] = { ...result[index], ...token };
    } else {
      // not implemented yet
      // console.log('addning', onlineToken.address);
      // result.push(token);
    }
  }

  return result;
}

export default function Tokens(): ReactElement {
  const { connected, networkId, address } = useEthers();
  const { setToken } = useDispatch();
  const [action, setAction] = useState<TokenAction>();
  const [{ tokens, token }, dispatch] = useAppState();
  const query = useTokensQuery({ variables: { owner: address } });
  const { reset } = useGraphql();
  const { data, loading, error } = query;
  // reloads current token if tokens update
  useEffect(() => {
    if (token) {
      setToken(tokens.find((t) => t.id === token.id));
    }
  }, [tokens]);

  function renderTokenState(localState: TokenState, token: TokenRecord): string {
    if (!connected) return 'Not connected';
    const result = [];
    if (token.isDeployed) result.push('Deployed');
    if (token.isFundraising) result.push('Fundraiser');
    if (token.isMinted) result.push('Minted');
    if (result.length === 0) result.push(tokenStates[localState] || 'Unknown state');
    return result.join(', ');
  }

  const columns = tableColumns<TokenRecord>([
    {
      title: 'Token',
      key: 'name',
      render: (name, token) => `${name} (${token.symbol})`,
    },
    {
      title: 'Status',
      key: 'localState',
      render: renderTokenState,
    },
    {
      title: 'Address',
      key: 'address',
      render: renderAddress,
    },
    {
      title: 'Action',
      key: 'action',
      render: (value: any, token: TokenRecord) => (
        <TokenActions token={token} onAction={(action) => handleAction(action, token)} />
      ),
    },
  ]);

  const dataSource = getTokenList(tokens, data?.tokens || [], networkId);
  console.log({ dataSource });

  const handleAction = (action: TokenAction, tokenRecord: TokenRecord) => {
    if (action === TokenAction.Delete) {
      handleDelete(tokenRecord);
    } else {
      setToken(tokenRecord.localToken);
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
    reset();
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
      return <TokenDeploy onCancel={handleClearAction} onReview={() => handleSwitchActionAnimated(TokenAction.Edit)} />;
    if (action === TokenAction.StartFundraise) return <TokenStartFundraiser onClose={handleClearAction} />;
    if (action === TokenAction.ManageToken) return <TokenManage />;
    if (action === TokenAction.ManageFundraise) return <TokenManageFundraiser />;
    if (action === TokenAction.StakeAndMint) return <TokenStakeAndMint onCancel={handleClearAction} />;
    if (action === TokenAction.Info) return <TokenInfo />;
  }

  return (
    <DefaultLayout title="My Tokens" headExtra={renderHeadExtra()} headTableAligned={true}>
      <Table columns={columns} dataSource={dataSource} rowKey="address" />
      <Drawer
        title={<TokenActionTitle action={action} />}
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
