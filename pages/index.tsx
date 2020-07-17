import React from 'react';
import { MetamaskConnect } from '../components/auth/MetamaskConnect';

interface IndexProps {
  title?: string;
}

export default function Index({ title }: IndexProps) {
  return (
    <div>
      <p>Index</p>
      <MetamaskConnect />
    </div>
  );
}
