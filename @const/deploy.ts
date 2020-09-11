import {
  FundraiserDeployerState,
  TokenDeployerState,
  TransactionStateMeta,
  TransactionState,
  DeployerStatesMeta,
} from '@types';

export const transactionStatesMeta: { [index in TransactionState]: TransactionStateMeta } = {
  [TransactionState.None]: {
    message: "Transaction hasn't been initiated yet",
  },
  [TransactionState.Signing]: {
    message: 'Waiting for transaction signature',
  },
  [TransactionState.Confirming]: {
    message: 'Waiting for network confirmation',
  },
  [TransactionState.Confirmed]: {
    message: 'Done',
  },
};

export const tokenDeployerStatesMeta: DeployerStatesMeta = {
  [TokenDeployerState.None]: {
    message: 'Ready to deploy',
    description: 'To start the deployment process, just click the button.',
    percent: 0,
  },
  [TokenDeployerState.TransferRules]: {
    message: 'Deploying transfer rules contract',
    description: 'Transfer rules define the restrictions on who may transfer your token to whom',
    percent: 20,
  },
  [TokenDeployerState.Features]: {
    message: 'Deploying token features contract',
    description: 'This contract stores your token configuration',
    percent: 40,
  },
  [TokenDeployerState.Roles]: {
    message: 'Deploying roles contract',
    description: 'This contract remembers your token features and enables you to use them',
    percent: 60,
  },
  [TokenDeployerState.Token]: {
    message: 'Deploying your SRC20 token',
    description: 'This is your actual SRC20 token. Use it well!',
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
    message: 'Deploy fundraiser contract',
    description: 'The main contract that manages your fundraiser.',
    percent: 25,
  },
  [FundraiserDeployerState.ContributorRestrictions]: {
    message: 'Deploy contributor restrictions contract',
    description: 'List of contributors has to be maintained - that’s what this contract is for.',
    percent: 50,
  },
  [FundraiserDeployerState.Setup]: {
    message: 'Setting up fundraiser contract',
    description: 'There’ some additional setup we have to do with a separate transaction.',
    percent: 75,
  },
  [FundraiserDeployerState.Finished]: {
    message: 'Fundraiser deployment is finished',
    description: 'Hooray! You can let the world know that they can start sending you money!',
    percent: 100,
  },
};
