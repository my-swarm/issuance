import React from 'react';

export const manageSupply = {
  title: 'Manage token supply',
  content: (
    <>
      <p>
        <strong>Current Supply information and ability to increase or decrease it.</strong>
      </p>
      <p>Token supply can be increased when up to Max supply is or decreased when Available supply is non-zero.</p>
      <p>When increasing supply, additinoal fee might be required if your token&apos;s nav has increased</p>
    </>
  ),
};

export const increaseSupply = {
  title: 'Mint token (increase supply)',
  content: (
    <>
      <p>
        You can increase your token&apos;s supply at any time up to the maximum supply. When maximum supply is
        unlimited, you can increase it indefinitely (note: there&apos;s a technical limitation implied by the number
        representation depending on the token decimals, but most of the cases, it&apos;s very high)
      </p>
      <p>
        If your token&apos;s NAV was increased prior additional mint, SWM fee is recalculated and the difference has to
        be paid. It will be subtracted automatically during the mint.
      </p>
    </>
  ),
};

export const decreaseSupply = {
  title: 'Burn token (decrease supply)',
  content: (
    <>
      <p>As long as you have a non-zero available supply, you can decrease the total token supply.</p>
    </>
  ),
};
