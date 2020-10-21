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
      window.setTimeout(() => client.resetStore(), timeout);
    }
  };

  return {
    reset,
  };
}
