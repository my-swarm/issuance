import React from 'react';

interface MyAccountProps {
  title?: string;
}

export default function Account({ title }: MyAccountProps) {
  return <p>My account</p>;
}
