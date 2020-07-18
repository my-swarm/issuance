import React from 'react';
import { PageHeader, Table, Button } from 'antd';
import { dummyTokens as tokens } from '../dummy-data/dummy-tokens';
import { DefaultLayout } from '../components/layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function TokenEdit() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <DefaultLayout title={`Editing token ${id}`}>
      <p>Tyvole neasi</p>
    </DefaultLayout>
  );
}
