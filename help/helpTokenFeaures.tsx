import React from 'react';

export const allowAccountFreeze = {
  title: 'Account Freeze',
  content: (
    <div>
      <p>
        Allows token issuer to prohibit transfers to or from a specific wallet address. Can be overridden using Force
        Transfer.
      </p>
    </div>
  ),
};

export const allowContractFreeze = {
  title: 'Contract Freeze',
  content: (
    <div>
      <p>
        Allows token issuer to (temporarily or permanently) disable all token transfers. Can be overridden using Force
        Transfer.
      </p>
    </div>
  ),
};

export const allowForceTransfer = {
  title: 'Force Transfer',
  content: (
    <div>
      <p>Allows token issuer to initiate a transfer between any wallet addresses.</p>
    </div>
  ),
};

export const allowBurn = {
  title: 'Burn Tokens',
  content: (
    <div>
      <p>
        Allows token issuer to burn (subtract) an amount of tokens from a specific address, reducing the total supply.
      </p>
    </div>
  ),
};

export const allowMint = {
  title: 'Mint Additional Tokens',
  content: (
    <div>
      <p>
        Allows the token issuer to mint (create) additinal tokens, increasing the total supply. Minting will require an
        additional stake of SWM.
      </p>
    </div>
  ),
};
