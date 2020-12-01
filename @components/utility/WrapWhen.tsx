import React, { ReactElement } from 'react';

interface WrapWhenProps {
  when: boolean;
  wrapper: (children: ReactElement | string) => ReactElement;
  children: ReactElement | string;
}
export function WrapWhen({ when, wrapper, children }: WrapWhenProps): ReactElement {
  return when ? wrapper(children) : <>{children}</>;
}
