import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { Button } from 'antd';

import { useAppState, useEthers } from '@app';
import { mergeLocalOnlineTokens, TokenAction } from '@lib';
import { useTokensLazyQuery } from '@graphql';
import { DefaultLayout, DevTransferTest, Loading, TokenList } from '@components';

export default function Tokens(): ReactElement {
  const { networkId, address } = useEthers();
  const [action, setAction] = useState<TokenAction>();
  const [{ tokens }] = useAppState();
  const [loadQuery, { data, loading, refetch }] = useTokensLazyQuery();

  useEffect(() => {
    if (address) loadQuery({ variables: { owner: address } });
  }, [address, loadQuery]);

  const tokenList = useMemo(() => {
    return mergeLocalOnlineTokens(tokens, data?.tokens || [], networkId);
  }, [data?.tokens, networkId, tokens]);

  if (loading) return <Loading />;

  const handleCreate = () => {
    setAction(TokenAction.Create);
  };

  const renderHeadExtra = () => (
    <Button key="1" type="primary" onClick={() => handleCreate()}>
      Create token
    </Button>
  );

  return (
    <DefaultLayout title="Issue and Manage Tokens" headExtra={renderHeadExtra()} headTableAligned={true}>
      <TokenList
        tokens={tokenList}
        outsideAction={action}
        onClearAction={() => setAction(undefined)}
        refetch={refetch}
      />
      {/*<DevTransferTest token={tokenList.find((t) => t.address === '0xded14cb100441f7f50746ee9af4e2804212b53ef')} />*/}
    </DefaultLayout>
  );
}
