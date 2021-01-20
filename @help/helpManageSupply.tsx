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
  title: 'Increase token supply',
  content: (
    <>
      <p>
        You can increase your token&apos;s supply at any time up to the maximum supply. When maximum supply is
        unlimited, you can increase it indefinitely (note: there&apos;s a technical limitation implied by the number
        representation depending on the token decimals, but most of the cases, it&apos;s very high)
      </p>
      <p>
        Every time you increase the supply, you need to stake additional SWM. The stake amount is computed to keep the
        same ratio of supply:stake.
      </p>
      <p>
        Example: If you intially minted 10,000 tokens and staked 5,000 SWM, additinal minting of 2,000 tokens will
        require 1,000 SWM stake (keeping the ratio of 2:1)
      </p>
    </>
  ),
};

export const decreaseSupply = {
  title: 'Decrease token supply',
  content: (
    <>
      <p>
        As long as you have a non-zero available supply, you can decrease token supply and a proportion of your SWM
        stake will be returned to you.
      </p>
      <p>The SWM amount returned keeps the initial stake &amp; mint ratio, same as when increasing the supply.</p>
    </>
  ),
};
