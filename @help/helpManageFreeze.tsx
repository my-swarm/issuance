import React from 'react';

export const manageFreeze = {
  title: 'Freeze Token',
  content: (
    <>
      <p>Allows you to to freeze your token contract, effectively disabling all transactions on it.</p>
      <p>
        Note that this only effect common transactions between investors and as a token issuer, you will still be able
        to force transfer without restrictions.
      </p>
    </>
  ),
};
