import React, { ReactElement, ReactNode } from 'react';

interface AddressProps {
  children: ReactNode;
}

export function Address({ children }: AddressProps): ReactElement | null {
  if (typeof children !== 'string') {
    return null;
  }
  const chunks = children.match(/.{1,4}/g);
  if (!chunks || chunks.length <= 1) {
    return <div className="c-address">children</div>;
  }
  return (
    <div className="c-address">
      {chunks.map((part, key) => (
        <span key={key}>{part}</span>
      ))}
    </div>
  );
}
