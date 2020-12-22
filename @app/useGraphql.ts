import { useApolloClient } from '@apollo/client';

interface UseGraphqlResult {
  reset: () => void;
}

export function useGraphql() {
  const client = useApolloClient();

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
