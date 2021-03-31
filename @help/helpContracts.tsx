import React from 'react';

export const contractsSrc20 = {
  title: 'SRC20 Token Contract',
  shortTitle: 'SRC20 Token',
  content: (
    <p>
      SRC20 token framework of the Swarm protocol. It gives token issuers the tools to perform regulatory compliant
      security token issuances.
    </p>
  ),
};

export const contractsFeatures = {
  title: 'Features Contract',
  shortTitle: 'Features',
  content: (
    <p>
      This contract defines the supported token contract features for a specific SRC20 token (e.g. account or contract
      freezing, additional minting or burning tokens) and allows to check the state of the token contract (e.g if it is
      currently paused for transfers).
    </p>
  ),
};

export const contractsTransferRules = {
  title: 'Transfer Rules Contract',
  shortTitle: 'Transfer Rules',
  content: (
    <p>
      Manages whitelist and greylist for your token. Whitelist restricts all transfers to a given set of accounts.
      Greylisted accounts need explicit transfer confirmations by token issuer.
    </p>
  ),
};

export const contractsFundraiser = {
  title: 'Fundraiser Contract',
  shortTitle: 'Fundraiser',
  content: <p>Operates the actual SwarmPoweredFundraise; finalizes via stakeToMint</p>,
};

export const contractsContributorRestrictions = {
  title: 'Contributor Restrictions Contract',
  shortTitle: 'Contributor Restrictions',
  content: <p>Manages whitelist and restrictions for each contributor in a Swarm Powered Fundraise</p>,
};

export const contractsAffiliateManager = {
  title: 'Affiliate Manager Contract',
  shortTitle: 'Affiliate Manager',
  content: <p>Manages affiliates</p>,
};
