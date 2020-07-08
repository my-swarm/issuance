import React from 'react';

interface MyAccountProps {
  title?: string;
}

export default function MyAccount({ title }: MyAccountProps) {
  return <p>My account</p>;
}
