import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Drawer, Table } from 'antd';

import { useAppState, useDispatch, useEthers, useGraphql } from '@app';
import {
  BaseError,
  LocalToken,
  OnlineToken,
  processNewToken,
  TokenAction,
  TokenRecord,
  TokenState,
  tokenStates,
} from '@lib';
import { useTokensLazyQuery } from '@graphql';
import {
  Address,
  DefaultLayout,
  Loading,
  TokenActions,
  TokenActionTitle,
  TokenDeploy,
  TokenForm,
  TokenInfo,
  TokenManage,
  TokenManageFundraiser,
  TokenMint,
  TokenStartFundraiser,
} from '@components';
import { renderAddress, tableColumns } from '@components/manage/listUtils';
import { BigNumber } from '@ethersproject/bignumber';

/**
 * Merges local underploed tokens with deployedTokens.
 *
 * @param localTokens
 * @param onlineTokens
 * @param networkId
 */
function getTokenList(localTokens: LocalToken[], onlineTokens: OnlineToken[], networkId): TokenRecord[] {
  if (!networkId) return [];

  const result: TokenRecord[] = onlineTokens.map((token) => ({
    ...(({ id, name, symbol, address }) => ({ id, name, symbol, address }))(token),
    isMinted: BigNumber.from(token.supply).gt(0),
    isFundraising: token.currentFundraiser !== null,
    onlineToken: token,
  }));

  for (const token of localTokens) {
    const { state, addresses } = token.networks[networkId] || { state: TokenState.Created, address: undefined };
    if (state <= TokenState.Deploying) {
      result.push({
        ...(({ id, name, symbol }) => ({ id, name, symbol }))(token),
        address: null,
        isMinted: false,
        isFundraising: false,
        localToken: token,
        localState: state,
      });
    } else {
      const record = result.find((t) => t.address === addresses.src20);
      if (record) {
        record.localToken = token;
      }
    }
  }

  return result;
}

export default function Tokens(): ReactElement {
  const { connected, networkId, address } = useEthers();
  const { setToken } = useDispatch();
  const [action, setAction] = useState<TokenAction>();
  const [{ tokens, localToken }, dispatch] = useAppState();
  const [loadQuery, query] = useTokensLazyQuery();
  useEffect(() => {
    if (address) loadQuery({ variables: { owner: address } });
  }, [address]);
  const { reset } = useGraphql();
  const { data, loading } = query;
  if (loading) return <Loading />;

  // reloads current token if tokens update ????
  /*
  useEffect(() => {
    if (localToken) {
      setToken(
        tokens.find((t) => t.id === localToken.id),
        undefined,
      );
    }
  }, [tokens]);
*/

  function renderTokenState(localState: TokenState, token: TokenRecord): string {
    if (!connected) return 'Not connected';
    const result = [];
    if (token.address) result.push('Deployed');
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

  const handleAction = (action: TokenAction, tokenRecord: TokenRecord) => {
    if (action === TokenAction.Delete) {
      handleDelete(tokenRecord);
    } else {
      setToken(tokenRecord.localToken, tokenRecord.onlineToken);
      setAction(action);
    }
  };

  const handleCreate = () => {
    setToken(undefined, undefined);
    setAction(TokenAction.Create);
  };

  const handleClearAction = () => {
    // reseting this fucks up any component that's still active before closing the drawer and needs the token state
    // setToken(undefined, undefined);
    setAction(undefined);
    reset();
  };

  const handleSubmit = (newToken: LocalToken) => {
    switch (action) {
      case TokenAction.Create:
        dispatch({ type: 'addToken', token: processNewToken(newToken) });
        break;
      case TokenAction.Edit:
        dispatch({ type: 'updateToken', token: { id: localToken.id, ...newToken } });
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
      return <TokenForm onSubmit={handleSubmit} onCancel={handleClearAction} formData={localToken} />;
    if (action === TokenAction.Deploy)
      return <TokenDeploy onCancel={handleClearAction} onReview={() => handleSwitchActionAnimated(TokenAction.Edit)} />;
    if (action === TokenAction.StartFundraise) return <TokenStartFundraiser onClose={handleClearAction} />;
    if (action === TokenAction.ManageToken) return <TokenManage />;
    if (action === TokenAction.ManageFundraise) return <TokenManageFundraiser />;
    if (action === TokenAction.Mint) return <TokenMint onCancel={handleClearAction} />;
    if (action === TokenAction.Info) return <TokenInfo />;
  }

  return (
    <DefaultLayout title="Issue and Manage Tokens" headExtra={renderHeadExtra()} headTableAligned={true}>
      <Table columns={columns} dataSource={dataSource} rowKey="id" />
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
