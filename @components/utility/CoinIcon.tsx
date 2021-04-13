import React, { ReactElement } from 'react';

interface Props {
  name: string;
}

export function CoinIcon({ name }): ReactElement {
  return <img className="c-icon" src={`/images/coins/${name}.svg`} alt={name} />;
}
