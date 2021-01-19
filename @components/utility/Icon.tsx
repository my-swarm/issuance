import React, { ReactElement } from 'react';

interface Props {
  name: string;
}

export function Icon({ name }): ReactElement {
  return <img className="c-icon" src={`/images/${name}.svg`} alt={name} />;
}
