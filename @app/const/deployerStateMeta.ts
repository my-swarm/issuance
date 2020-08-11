import { DeployerState } from '@types';

interface DeployerStateMeta {
  visual: boolean;
  persistent: boolean;
  message?: string;
  description?: string;
  percent?: number;
}

export const deployerStateMeta: { [index in DeployerState]: DeployerStateMeta } = {
  [DeployerState.None]: {
    visual: true,
    persistent: true,
    message: 'Ready to deploy',
    description:
      "To start the deployment process, just click the button. You'll be asked for signatures when necessary",
    percent: 0,
  },
  [DeployerState.Started]: {
    visual: false,
    persistent: false,
  },
  [DeployerState.TransferRulesStarted]: {
    visual: true,
    persistent: false,
    message: 'Deploying transfer rules contract',
    description: 'Transfer rules define the restrictions on who may transfer your token to whom',
    percent: 10,
  },
  [DeployerState.TransferRulesFinished]: {
    visual: false,
    persistent: true,
  },
  [DeployerState.FeaturesStarted]: {
    visual: true,
    persistent: false,
    message: 'Deploying token features contract',
    description: 'This contract stores your token configuration',
    percent: 20,
  },
  [DeployerState.FeaturesFinished]: {
    visual: false,
    persistent: true,
  },
  [DeployerState.RolesStarted]: {
    visual: true,
    persistent: false,
    message: 'Deploying roles contract',
    percent: 30,
  },
  [DeployerState.RolesFinished]: {
    visual: false,
    persistent: true,
  },
  [DeployerState.TokenStarted]: {
    visual: true,
    persistent: false,
    message: 'Deploying your SRC20 token',
    percent: 40,
  },
  [DeployerState.TokenFinished]: {
    visual: false,
    persistent: true,
  },
  [DeployerState.StakeApproveStarted]: {
    visual: true,
    persistent: false,
    message: 'Approving SWM spending for your stake',
    percent: 50,
  },
  [DeployerState.StakeApproveFinished]: {
    visual: false,
    persistent: true,
  },
  [DeployerState.MintStarted]: {
    visual: true,
    persistent: false,
    message: 'Minting your token',
    percent: 60,
  },
  [DeployerState.MintFinished]: {
    visual: false,
    persistent: true,
  },
  [DeployerState.Finished]: {
    visual: true,
    persistent: true,
    message: "Deployment hasn't started yet",
    percent: 100,
  },
  [DeployerState.Error]: {
    visual: true,
    persistent: false,
  },
};
