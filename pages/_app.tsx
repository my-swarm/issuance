import React from 'react';
import { AppProps } from 'next/app';
import '../styles/index.scss';
import { DefaultLayout } from '../components/layout/DefaultLayout';

function MyApp({ Component, pageProps }: AppProps) {
  console.log({ pageProps });
  return (
    <DefaultLayout>
      <Component {...pageProps} />
    </DefaultLayout>
  );
}

export default MyApp;
