import React from 'react';
import { DefaultLayout } from '@components/layout';

interface MyAccountProps {
  title?: string;
}

export default function Account({ title }: MyAccountProps) {
  return (
    <DefaultLayout title="My Account">
      <p>Nothing here yet...</p>
    </DefaultLayout>
  );
}
