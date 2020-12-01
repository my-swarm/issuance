import React, { ReactElement, ReactNode } from 'react';

interface BoxProps {
  color?: string;
  children: ReactNode;
}

export function Box({ color = 'red', children }: BoxProps): ReactElement {
  return <div className="c-box">{children}</div>;
}
