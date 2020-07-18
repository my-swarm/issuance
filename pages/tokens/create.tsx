import React from 'react';
import { DefaultLayout, TokenForm } from '@components';
import { useRouter } from 'next/router';

export default function TokenEdit() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <DefaultLayout title="Create new token">
      <TokenForm />
    </DefaultLayout>
  );
}
