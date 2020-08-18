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
    message: 'Ready to deploy',
    description: 'To start the deployment process, just click the button.',
    percent: 0,
  },
  [DeployerState.TransferRules]: {
    message: 'Deploying transfer rules contract',
    description: 'Transfer rules define the restrictions on who may transfer your token to whom',
    percent: 20,
  },
  [DeployerState.Features]: {
    message: 'Deploying token features contract',
    description: 'This contract stores your token configuration',
    percent: 40,
  },
  [DeployerState.Roles]: {
    message: 'Deploying roles contract',
    description: 'This contract remembers your token features and enables you to use them',
    percent: 60,
  },
  [DeployerState.Token]: {
    message: 'Deploying your SRC20 token',
    descriptiption: 'This is your actual SRC20 token. Use it well!',
    percent: 80,
  },
  [DeployerState.Finished]: {
    visual: true,
    persistent: true,
    message: 'Token deployment is finished',
    description: 'You can now mint or start a fundraiser',
    percent: 100,
  },
};
