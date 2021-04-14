import React, { ReactElement, useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { ApolloClient, ApolloProvider, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import '../styles/index.less';
import { EthersProvider, reducer, StateProvider } from '@app';
import { MetamaskNotReadyError } from '@lib';
import { DevAccountSwitcher } from '@components';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  const router = useRouter();
  const [apolloClient, setApolloClient] = useState<ApolloClient<NormalizedCacheObject>>();
  const [devAccountId, setDevAccountId] = useState<number>(1);

  useEffect(() => {
    window.onerror = function (msg, url, line, col, error) {
      if (error instanceof MetamaskNotReadyError) {
        // don't care, right?
        // alert('Metamask disconnected. To continue using the app, connect again.');
        console.log('ingnoring metamask error');
      } else {
        console.log('uncaught error', { msg, url, line, col, error });
      }
    };
  }, []);

  // todo: graphql url depends on env/networkId
  useEffect(() => {
    const clientConfig = {
      uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      cache: new InMemoryCache(),
    };
    const client = new ApolloClient(clientConfig);
    setApolloClient(client);
  }, []);

  if (!apolloClient) return null;

  const isWidget = router.pathname.match(/^\/widgets\//);

  /*
  if (isWidget) {
    return (
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    );
  }
*/

  return (
    <StateProvider reducer={reducer}>
      <EthersProvider devAccountId={devAccountId}>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </EthersProvider>
      {!isWidget && <DevAccountSwitcher value={devAccountId} onChange={setDevAccountId} />}
    </StateProvider>
  );
}

export default MyApp;
