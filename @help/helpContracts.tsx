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

export const contractsRoles = {
  title: 'Roles Contract',
  shortTitle: 'Roles',
  content: (
    <p>
      This contract defines the owner of the token contract and all assigned roles. Manages the addresses that can
      perform restricted actions for a specific SRC20 token as defined by the contract owner. SRC20 tokens can have four
      types of roles: Owner, Authority, Manager and Delegate.
    </p>
  ),
};

export const contractsTransferRules = {
  title: 'Transfer Rules Contract',
  shortTitle: 'Transfer Rules',
  content: <p>Manages whitelists and greylists for holders of a specific SRC20 token</p>,
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
