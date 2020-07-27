import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import '../styles/index.scss';
import { EthersProvider, StateProvider, reducer } from '@app';
import { MetamaskNotReadyError } from '@lib';
import { StateStorageSync } from '@components';

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
    <StateProvider reducer={reducer}>
      <EthersProvider>
        <Component {...pageProps} />
        <StateStorageSync />
      </EthersProvider>
    </StateProvider>
  );
}

export default MyApp;
