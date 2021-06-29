import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Table } from 'antd';

import { useAppState, useDispatch, useEthers, useGraphql } from '@app';
import {
  BaseError,
  LocalToken,
  OnlineToken,
  processNewToken,
  TokenAction,
  TokenRecord,
  LocalTokenState,
  localTokenStates,
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
  TokenList,
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
    const state = token.networkState[networkId] || LocalTokenState.Created;
    if (state === LocalTokenState.Created) {
      result.push({
        ...(({ id, name, symbol }) => ({ id, name, symbol }))(token),
        address: null,
        isMinted: false,
        isFundraising: false,
        localToken: token,
        localState: state,
      });
    }
  }

  console.log({ localTokens });

  return result;
}

export default function Tokens(): ReactElement {
  const { networkId, address } = useEthers();
  const [action, setAction] = useState<TokenAction>();
  const [{ tokens, localToken }] = useAppState();
  const [loadQuery, { data, loading }] = useTokensLazyQuery();
  const { reset } = useGraphql();

  useEffect(() => {
    if (address) loadQuery({ variables: { owner: address } });
  }, [address, loadQuery]);

  const tokenList = useMemo(() => {
    return getTokenList(tokens, data?.tokens || [], networkId);
  }, [data?.tokens, networkId, tokens]);

  if (loading) return <Loading />;

  const handleCreate = () => {
    setAction(TokenAction.Create);
  };

  const handleClearAction = () => {
    // reseting this fucks up any component that's still active before closing the drawer and needs the token state
    // setToken(undefined, undefined);
    setAction(undefined);
    reset();
  };

  const renderHeadExtra = () => (
    <Button key="1" type="primary" onClick={() => handleCreate()}>
      Create token
    </Button>
  );

  return (
    <DefaultLayout title="Issue and Manage Tokens" headExtra={renderHeadExtra()} headTableAligned={true}>
      <TokenList tokens={tokenList} outsideAction={action} onClearAction={handleClearAction} />
    </DefaultLayout>
  );
}
