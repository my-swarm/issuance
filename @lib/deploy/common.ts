import { ReactNode } from 'react';
import * as help from '@help';

function helpToMeta(item: { title: string; content: ReactNode }): { message: string; description: ReactNode } {
  return {
    message: item.title,
    description: item.content,
  };
}

export const DeployerStateNone = 0;
export const DeployerStateFinished = -1;

export enum TokenDeployerState {
  None = DeployerStateNone,
  TransferRules = 1,
  Features,
  Roles,
  Token,
  Finished = DeployerStateFinished,
}

export enum FundraiserDeployerState {
  None = DeployerStateNone,
  Fundraiser = 1,
  ContributorRestrictions,
  AffiliateManager,
  Setup,
  Finished = DeployerStateFinished,
}

export type DeployerState = TokenDeployerState | FundraiserDeployerState;

// this
export type DeployerEventCallback = (state: DeployerState) => void;

// this
export interface DeployerStateMeta {
  message?: string;
  description?: ReactNode;
  percent?: number;
}

// DeployerProgress.tsx, deployStates.ts
export type DeployerStatesMeta = { [index in DeployerState]?: DeployerStateMeta };

export const tokenDeployerStatesMeta: DeployerStatesMeta = {
  [TokenDeployerState.None]: {
    message: 'Ready to deploy',
    description: 'To start the deployment process, just click the button.',
    percent: 0,
  },
  [TokenDeployerState.TransferRules]: {
    ...helpToMeta(help.contractsSrc20),
    percent: 20,
  },
  [TokenDeployerState.Features]: {
    ...helpToMeta(help.contractsFeatures),
    percent: 40,
  },
  [TokenDeployerState.Roles]: {
    ...helpToMeta(help.contractsRoles),
    percent: 60,
  },
  [TokenDeployerState.Token]: {
    ...helpToMeta(help.contractsSrc20),
    percent: 80,
  },
  [TokenDeployerState.Finished]: {
    message: 'Token deployment is finished',
    description: 'You can now mint or start a fundraiser',
    percent: 100,
  },
};

export const fundraiserDeployerStatesMeta: DeployerStatesMeta = {
  [FundraiserDeployerState.None]: {
    message: 'Ready to deploy',
    description: 'To start the deployment process, just click the button.',
    percent: 0,
  },
  [FundraiserDeployerState.Fundraiser]: {
    ...helpToMeta(help.contractsFundraiser),
    percent: 25,
  },
  [FundraiserDeployerState.ContributorRestrictions]: {
    ...helpToMeta(help.contractsContributorRestrictions),
    percent: 50,
  },
  [FundraiserDeployerState.AffiliateManager]: {
    ...helpToMeta(help.contractsAffiliateManager),
    percent: 50,
  },
  [FundraiserDeployerState.Setup]: {
    message: 'Fundraiser Contract setup',
    description: 'There’ some additional setup we have to do with a separate transaction.',
    percent: 75,
  },
  [FundraiserDeployerState.Finished]: {
    message: 'Deployment is finished',
    description: 'Hooray! You can let the world know that they can start sending you money!',
    percent: 100,
  },
};
