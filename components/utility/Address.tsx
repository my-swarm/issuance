import React from 'react';

interface AddressProps {
  children: string;
}

export function Address({ children }: AddressProps) {
  const chunks = children.match(/.{1,4}/g);
  if (!chunks || chunks.length <= 1) {
    return children;
  }
  return (
    <div className="c-address">
      {chunks.map((part, key) => (
        <span key={key}>{part}</span>
      ))}
    </div>
  );
}
