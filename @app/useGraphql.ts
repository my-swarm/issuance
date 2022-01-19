import { useApolloClient } from '@apollo/client';
import { useAppState } from './StateContext';

interface UseGraphqlResult {
  reset: () => void;
}

export function useGraphql() {
  const client = useApolloClient();
  const [{ subgraphSyncing }] = useAppState();

  const timeouts = [3000, 9000];

  function doReset() {
    // client.stop();
    // client.cache.reset();
    client.resetStore();
  }

  const reset = () => {
    doReset();
    for (const timeout of timeouts) {
      window.setTimeout(() => {
        doReset();
      }, timeout);
    }
  };

  return {
    reset,
  };
}
