import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import '../styles/index.scss';
import { EthersProvider } from '../context/EthersContext';
import { MetamaskNotReadyError } from '@lib/Metamask';

function MyApp({ Component, pageProps }: AppProps) {
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
  });
  return (
    <EthersProvider>
      <Component {...pageProps} />
    </EthersProvider>
  );
}

export default MyApp;
