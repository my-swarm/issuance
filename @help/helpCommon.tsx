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

export const currentFee = {
  title: 'SWM Fee paid',
  content: (
    <>
      <p>Total SWM fee paid for minting.</p>
      <p>Additional fee is paid when minting more tokens after NAV increase.</p>
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

export const supplyNav = {
  title: 'SWM tokens balance',
  content: <p>Your current Net Asset Value. On NAV increase, additional fee is paid.</p>,
};
