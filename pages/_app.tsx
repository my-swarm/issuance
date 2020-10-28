import React, { ReactElement, useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { ApolloProvider, ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import '../styles/index.scss';
import { EthersProvider, StateProvider, reducer } from '@app';
import { MetamaskNotReadyError } from '@lib';
import { StateStorageSync } from '@components';

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  const [apolloClient, setApolloClient] = useState<ApolloClient<NormalizedCacheObject>>();
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
    console.log({ clientConfig, client });
    setApolloClient(client);
  }, []);

  if (!apolloClient) return null;

  return (
    <StateProvider reducer={reducer}>
      <EthersProvider>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </EthersProvider>
    </StateProvider>
  );
}

export default MyApp;
