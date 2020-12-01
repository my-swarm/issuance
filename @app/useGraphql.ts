import { useApolloClient } from '@apollo/client';

interface UseGraphqlResult {
  reset: () => void;
}

export function useGraphql() {
  const client = useApolloClient();

  const timeouts = [1000, 3000, 9000];
  const reset = () => {
    client.resetStore();
    for (const timeout of timeouts) {
      window.setTimeout(() => {
        client.resetStore();
      }, timeout);
    }
  };

  return {
    reset,
  };
}
