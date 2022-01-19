import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { LoadingOutlined } from '@lib/icons';
import { useAppState } from '@app';
import { useMetaQuery } from '@graphql';

export function SubgraphSyncing(): ReactElement {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [{ subgraphSyncing, syncCallbacks }, dispatch] = useAppState();
  const [counter, setCounter] = useState<number>(0);
  const [oldBlock, setOldBlock] = useState<number>();
  const { data, refetch } = useMetaQuery();
  const block = data?._meta.block.number;

  useEffect(() => {
    if (!isInitialized && subgraphSyncing) {
      refetch().then(({ data }) => {
        setOldBlock(data._meta.block.number);
        setIsInitialized(true);
        setCounter(1);
      });
    }
  }, [subgraphSyncing, isInitialized, refetch]);

  // this runs on every
  useEffect(() => {
    if (!counter) return;

    if (block > oldBlock) {
      syncCallbacks.map((cb) => cb());
      dispatch({ type: 'endSubgraphSync' });
      setCounter(0);
      setOldBlock(undefined);
      setIsInitialized(false);
    }
  }, [block, counter, dispatch, oldBlock, syncCallbacks]);

  // if counter enabled, keep counting
  useEffect(() => {
    let to;
    if (counter) {
      refetch();
      to = setTimeout(() => setCounter(counter + 1), 5000);
    }
    return () => {
      if (to) clearTimeout(to);
    };
  }, [counter, refetch]);

  // if started syncing, empty old block
  useEffect(() => {
    if (subgraphSyncing) {
      setOldBlock(undefined);
    }
  }, [subgraphSyncing]);

  if (!subgraphSyncing) return null;

  return (
    <p>
      <LoadingOutlined /> <span>Syncing Indexed data</span>
    </p>
  );
}
