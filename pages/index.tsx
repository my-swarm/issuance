import React from 'react';
import { MetamaskConnect } from '@components';
import { DefaultLayout } from '@components';

interface IndexProps {
  title?: string;
}

export default function Index({ title }: IndexProps) {
  return (
    <DefaultLayout title="Home">
      <p>Index</p>
      <MetamaskConnect />
    </DefaultLayout>
  );
}
