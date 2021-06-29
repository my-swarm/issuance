import React, { ReactElement, useMemo } from 'react';
import { usePublicTokensQuery } from '@graphql';
import { Loading, TokenList } from '@components';
import { BigNumber } from '@ethersproject/bignumber';

export function TokenListPublic(): ReactElement {
  const { data, loading } = usePublicTokensQuery();

  const tokens = useMemo(() => {
    if (!data) return [];
    return data.tokens.map((token) => ({
      ...(({ id, name, symbol, address }) => ({ id, name, symbol, address }))(token),
      isMinted: BigNumber.from(token.supply).gt(0),
      isFundraising: token.currentFundraiser !== null,
      onlineToken: token,
    }));
  }, [data]);

  if (loading) return <Loading />;

  return <TokenList tokens={tokens} isPublic />;
}
