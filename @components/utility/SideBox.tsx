import React, { ReactNode, ReactElement } from 'react';

interface Props {
  margin?: 2 | 3 | 4;
  children: ReactNode;
}

export function SideBox({ children, margin = 3 }: Props): ReactElement {
  return <div className={`c-side-box mt-${margin}`}>{children}</div>;
}
