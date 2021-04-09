import React, { PropsWithChildren, ReactElement } from 'react';

interface Props {
  legend: string | ReactElement;
}

export function Fieldset({ children, legend }: PropsWithChildren<Props>): ReactElement {
  return (
    <fieldset className="ant-fieldset">
      <legend>{legend}</legend>
      {children}
    </fieldset>
  );
}
