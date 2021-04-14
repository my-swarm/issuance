import React from 'react';

export const manageSupply = {
  title: 'Manage tokens supply',
  content: (
    <>
      <p>
        <strong>Current Stake&amp;Mint information and control over your current supply and stake.</strong>
      </p>
      <p>
        Token supply can be increased when Max supply is larger than Supply or decreased when Available supply is
        non-zero.
      </p>
      <p>
        In both cases, the additional stake (or stake returned) is computed to match the same supply:stae ratio of the
        initial Stake&amp;Mint
      </p>
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
        If your token&apos;s NAV was increaset prior additional mint, SWM fee is recalculated and the difference has to
        be paid. It will be subtracted automatically during the mint.
      </p>
    </>
  ),
};

export const decreaseSupply = {
  title: 'Burn token (decrease supply)',
  content: (
    <>
      <p>
        As long as you have a non-zero available supply, you can decrease token supply and a proportion of your SWM
        stake will be returned to you.
      </p>
    </>
  ),
};
