import { Token } from '@types';
import { BytesLike, ContractInterface, Signer } from 'ethers';

import TransferRulesContract from '../contracts/TrasferRules.json';
import { ContractFactory } from 'ethers';

export enum TokenDeployerState {
  None,
  DeployStarted,
  TransferRulesStarted,
  TransferRulesFinished,
  FeaturesStarted,
  FeaturesFinished,
  DeployFinished,
  Error,
}

export interface TokenDeployerStateMeta {
  title: string;
  percent?: number;
}

export const tokenDeployerStateMeta = {
  [TokenDeployerState.None]: {
    // id: TokenDeployerState.None,
    title: "Deployment hasn't started yet",
    percent: 0,
  },
  [TokenDeployerState.DeployStarted]: {
    // id: [TokenDeployerState.DeployStarted],
    title: 'Deployment started',
    percent: 10,
  },
  [TokenDeployerState.TransferRulesStarted]: {
    title: 'Deploying transfer rules contract',
    percent: 10,
  },
  [TokenDeployerState.TransferRulesFinished]: {
    title: 'Transfer rules contract deployed',
    percent: 20,
  },
  [TokenDeployerState.FeaturesStarted]: {
    title: "Deployment hasn't started yet",
    percent: 20,
  },
  [TokenDeployerState.FeaturesFinished]: {
    title: "Deployment hasn't started yet",
    percent: 30,
  },
  [TokenDeployerState.DeployFinished]: {
    title: "Deployment hasn't started yet",
    percent: 30,
  },
  [TokenDeployerState.Error]: {
    title: "Deployment hasn't started yet",
    percent: 30,
  },
};

export type TokenDeployerEvent = {
  state: TokenDeployerState;
  meta: TokenDeployerStateMeta;
};

export enum TransactionState {
  None,
  Signing,
  Confirming,
  Confirmed,
}

export interface TransactionStateMeta {
  title: string;
}

export const transactionStateMeta = {
  [TransactionState.None]: {
    title: 'Waiting for transaction to start',
  },
  [TransactionState.Signing]: {
    title: 'Waiting for transaction signature',
  },
  [TransactionState.Confirming]: {
    title: 'Waiting for confirmations',
  },
  [TransactionState.Confirmed]: {
    title: 'Done',
  },
};

export type TransactionEvent = {
  state: TransactionState;
  meta: TransactionStateMeta;
};

type TokenDeployerEventCallback = (event: TokenDeployerEvent) => void;
type TransactionEventCallback = (event: TransactionEvent) => void;

export class TokenDeployer {
  private readonly token: Token;
  private readonly signer: Signer;
  private state: TokenDeployerState = TokenDeployerState.None;
  private callbacks: TokenDeployerEventCallback[] = [];
  private transactionCallbacks: TransactionEventCallback[] = [];

  constructor(token: Token, signer: Signer) {
    this.token = token;
    this.signer = signer;
  }

  public async deploy(): Promise<void> {
    console.log(this.token, TransferRulesContract);
    this.fireEvent(TokenDeployerState.DeployStarted);
    await this.deployTransferRules();
    await this.deployFeatures();
    this.fireEvent(TokenDeployerState.DeployFinished);
  }

  private async deployContract(
    contract: { abi: ContractInterface; bytecode: BytesLike },
    args: Array<any>,
  ): Promise<void> {
    const contractFactory = new ContractFactory(contract.abi, contract.bytecode, this.signer);
    this.fireTransactionEvent(TransactionState.Signing);
    const contractInstance = await contractFactory.deploy(...args);
    this.fireTransactionEvent(TransactionState.Confirming);
    await contractInstance.deployTransaction.wait();
    this.fireTransactionEvent(TransactionState.Confirmed);
    console.log({ contractInstance });
  }

  private async deployTransferRules(): Promise<void> {
    const owner = this.signer.getAddress();

    this.fireEvent(TokenDeployerState.TransferRulesStarted);
    await this.deployContract(TransferRulesContract, [owner]);
    this.fireEvent(TokenDeployerState.TransferRulesFinished);
  }

  private async deployFeatures(): Promise<void> {
    this.fireEvent(TokenDeployerState.FeaturesStarted);
    console.log('deploying token features');
    this.fireEvent(TokenDeployerState.FeaturesFinished);
  }

  public onProgress(callback: TokenDeployerEventCallback): void {
    this.callbacks.push(callback);
  }

  public onTransactionProgress(callback: TransactionEventCallback): void {
    this.transactionCallbacks.push(callback);
  }

  private fireEvent(state: TokenDeployerState): void {
    this.state = state;
    const event: TokenDeployerEvent = {
      state,
      meta: tokenDeployerStateMeta[state],
    };
    for (const callback of this.callbacks) {
      callback(event);
    }
  }

  private fireTransactionEvent(state: TransactionState): void {
    // this.transtate = state;
    const event: TransactionEvent = {
      state,
      meta: transactionStateMeta[state],
    };
    for (const callback of this.transactionCallbacks) {
      callback(event);
    }
  }
}
