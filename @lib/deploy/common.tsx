import React, { ReactNode } from 'react';
import * as help from '@help';

function helpToMeta(item: { title: string; content: ReactNode }): { message: string; description: ReactNode } {
  return {
    message: item.title,
    description: item.content,
  };
}

export const DeployerStateNone = 0;
export const DeployerStateFinished = -1;

export enum DeployerState {
  None = DeployerStateNone,
  TransferRules = 11,
  Features = 12,
  Roles = 13,
  Token = 14,
  Fundraiser = 21,
  ContributorRestrictions = 22,
  AffiliateManager = 23,
  Setup = 24,
  Finished = DeployerStateFinished,
}

// this
export interface DeployerStateMeta {
  message?: string;
  description?: ReactNode;
  percent?: number;
}

// DeployerProgress.tsx, deployStates.ts
export type DeployerStatesMeta = { [index in DeployerState]?: DeployerStateMeta };

export const deployerStatesMeta: DeployerStatesMeta = {
  [DeployerState.None]: {
    message: 'Ready to deploy',
    description: <p>To start the deployment process, just click the button.</p>,
    percent: 0,
  },
  [DeployerState.TransferRules]: {
    ...helpToMeta(help.contractsSrc20),
    percent: 20,
  },
  [DeployerState.Features]: {
    ...helpToMeta(help.contractsFeatures),
    percent: 40,
  },
  [DeployerState.Roles]: {
    ...helpToMeta(help.contractsRoles),
    percent: 60,
  },
  [DeployerState.Token]: {
    ...helpToMeta(help.contractsSrc20),
    percent: 80,
  },
  [DeployerState.Fundraiser]: {
    ...helpToMeta(help.contractsFundraiser),
    percent: 25,
  },
  [DeployerState.ContributorRestrictions]: {
    ...helpToMeta(help.contractsContributorRestrictions),
    percent: 50,
  },
  [DeployerState.AffiliateManager]: {
    ...helpToMeta(help.contractsAffiliateManager),
    percent: 50,
  },
  [DeployerState.Setup]: {
    message: 'Fundraiser Contract setup',
    description: <p>There is some additional setup we have to do with a separate transaction.</p>,
    percent: 75,
  },
  [DeployerState.Finished]: {
    message: 'Deployment is finished',
    description: null,
    percent: 100,
  },
  /*
  // fundraiser finished
  [DeployerState.Finished]: {
    message: 'Deployment is finished',
    description: 'Hooray! You can let the world know that they can start sending you money!',
    percent: 100,
  },
 */
};
