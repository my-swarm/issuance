import React, { ReactElement } from 'react';

export function VSpace({ size = 3 }: { size?: 1 | 2 | 3 | 4 }): ReactElement {
  return <div className={`mb-${size}`} />;
}
