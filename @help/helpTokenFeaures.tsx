import React from 'react';

export const allowTransferRules = {
  title: 'Transfer Rules (Whitelist, Greylist)',
  content: (
    <div>
      Allows token issuer to manage allowed token holders via whitelists and greylists. Whitelist restricts all
      transfers to a given set of accounts. Greylisted accounts need explicit transfer confirmations by token issuer.
    </div>
  ),
};

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
  title: 'Burn Tokens from accounts',
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
        Allows the token issuer to mint (create) additional tokens, increasing the total supply. Minting will require an
        additional stake of SWM.
      </p>
    </div>
  ),
};

export const allowAutoburn = {
  title: 'Automatic Token Burn',
  content: (
    <div>
      <p>
        Burns all tokens at a specified point in time. After the automatic burn, all account balances will show zero and
        transfers won&apos;t work
      </p>
      <p>
        The time is{' '}
        <a href="https://en.wikipedia.org/wiki/Coordinated_Universal_Time" target="_blank" rel="noreferrer noopener">
          UTC time
        </a>
        , same as the time that&apos;s used in Ethereum.
      </p>
    </div>
  ),
};
