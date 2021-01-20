import React from 'react';

export const supply = {
  title: 'Supply',
  content: (
    <>
      <p>Current token minted supply, in other words, all tokens ever in existence. Parts of the supply can be</p>
      <ul>
        <li>distributed (owned by investors),</li>
        <li>undistributed (owned by token issuer) or</li>
        <li>burned (out of cirtualation, not owned by anyone)</li>
      </ul>
    </>
  ),
};

export const maxSupply = {
  title: 'Maximum Supply',
  content: (
    <p>Maximum number of tokens that can ever be minted. You can increase your Supply up to the value of this value.</p>
  ),
};

export const availableSupply = {
  title: 'Available Supply',
  content: <p>The amount of tokens in the token issuer&apos;s wallet. These tokens can be distributed to investors.</p>,
};

export const currentStake = {
  title: 'Current SWM Stake',
  content: (
    <>
      <p>Current number of SWM tokens staked against the minted supply.</p>
      <p>
        When supply is increased or decreased after initial stake &amp; mint, stake is increased or decreased to
        maintain the same supply:stake ratio.
      </p>
    </>
  ),
};

export const swmBalance = {
  title: 'SWM tokens balance',
  content: (
    <p>
      The amount of SWM tokens in your wallet. If there&apos;s not enough to increase your stake, you&apos;ll have to
      get some more.
    </p>
  ),
};

export const swmAllowance = {
  title: 'SWM spending allowance',
  content: (
    <p>
      The amount of SWM tokens you have approved the minting contract to spend on your behalf. If it&amp;s zero or less
      than needed for supply increase, you&amp;ll be asked to approve more.
    </p>
  ),
};
