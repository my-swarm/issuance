import { useApolloClient } from '@apollo/client';

interface UseGraphqlResult {
  reset: () => void;
}

export function useGraphql() {
  const client = useApolloClient();

  const timeouts = [500, 1000, 2000];
  const reset = () => {
    client.resetStore();
    for (const timeout of timeouts) {
      window.setTimeout(() => {
        client.resetStore();
        console.log('reset store after timeout ' + timeout);
      }, timeout);
    }
  };

  return {
    reset,
  };
}
