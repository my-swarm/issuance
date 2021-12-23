import React, { ReactElement, useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { ApolloClient, ApolloProvider, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import '../styles/index.less';
import { EthersProvider, graphqlEndpoints, reducer, StateProvider, useEthers } from '@app';
import { EthereumNetwork, MetamaskNotReadyError } from '@lib';
import { DevAccountSwitcher } from '@components';
import { useRouter } from 'next/router';

function InnerShit({ Component, pageProps }: AppProps): ReactElement {
  const { networkId } = useEthers();
  const [apolloClient, setApolloClient] = useState<ApolloClient<NormalizedCacheObject>>();

  const graphqlEndpoint = graphqlEndpoints[networkId] || graphqlEndpoints[EthereumNetwork.Main];

  // todo: graphql url depends on env/networkId
  useEffect(() => {
    const client = new ApolloClient({
      uri: graphqlEndpoint,
      cache: new InMemoryCache(),
    });
    setApolloClient(client);
  }, [graphqlEndpoint]);

  if (!apolloClient) return null;

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

function MyApp(props: AppProps): ReactElement {
  const router = useRouter();
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

  const isWidget = router.pathname.match(/^\/widgets\//);

  return (
    <StateProvider reducer={reducer}>
      <EthersProvider devAccountId={devAccountId}>
        <InnerShit {...props} />
      </EthersProvider>
      {!isWidget && <DevAccountSwitcher value={devAccountId} onChange={setDevAccountId} />}
    </StateProvider>
  );
}

export default MyApp;
