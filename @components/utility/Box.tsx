import React, { ReactElement, ReactNode } from 'react';

interface BoxProps {
  color?: string;
  children: ReactNode;
  subtle?: boolean;
}

export function Box({ children, subtle = false }: BoxProps): ReactElement {
  const className = `c-box ${subtle ? 'subtle' : ''}`;
  return <div className={className}>{children}</div>;
}
