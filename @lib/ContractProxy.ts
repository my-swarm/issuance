import { Contract, CallOverrides, Event } from '@ethersproject/contracts';
import { Signer } from '@ethersproject/abstract-signer';
import { Transaction } from '@ethersproject/transactions';
import { EthereumNetwork, OnlineToken, TransactionEventCallback, TransactionState } from '@lib';
import { getContractFactory, getContract, getContractAbi } from './contracts';

export class ContractProxy {
  private readonly _signer: Signer;
  private readonly _token: OnlineToken;
  private callbacks: TransactionEventCallback[] = [];
  private state: TransactionState = TransactionState.None;

  constructor(signer: Signer, onlineToken?: OnlineToken) {
    this._signer = signer;
    this._token = onlineToken;
  }

  private handleStateChange(state: TransactionState, transaction?: Transaction): void {
    this.state = state;
    for (const callback of this.callbacks) {
      callback(state);
    }
  }

  public async deploy(contractName: string, args: Array<any> = []): Promise<Contract> {
    console.log('ContractProxy.deploy', { contractName, args });
    const contractFactory = getContractFactory(contractName, this.signer);
    this.handleStateChange(TransactionState.Signing);
    const contractInstance = await contractFactory.deploy(...args, await this.getOverrides());
    this.handleStateChange(TransactionState.Confirming);
    await contractInstance.deployTransaction.wait();
    this.handleStateChange(TransactionState.Confirmed);
    return contractInstance;
  }

  public async call(
    contractName: string | [string, string],
    method: string,
    args: Array<any> = [],
    events: { [index: string]: (event: Event) => void } = {},
    overrides: CallOverrides = {},
  ): Promise<Transaction> {
    console.log('ContractProxy.call', { contractName, method, args, events, overrides });
    this.handleStateChange(TransactionState.None);
    let contract;
    if (typeof contractName === 'string') {
      contract = getContract(contractName, this.signer, await this.signer.getChainId(), this._token);
    } else {
      contract = new Contract(contractName[1], getContractAbi(contractName[0]), this.signer);
    }
    for (const [eventName, eventHandler] of Object.entries(events)) {
      contract.once(eventName, (oldValue, newValue) => eventHandler(newValue));
    }
    this.handleStateChange(TransactionState.Signing);
    const transaction = await contract[method](...args, await this.getOverrides(overrides));
    this.handleStateChange(TransactionState.Confirming, transaction);
    await transaction.wait();
    this.handleStateChange(TransactionState.Confirmed, transaction);
    return transaction;
  }

  private async getOverrides(overrides: CallOverrides = {}): Promise<CallOverrides> {
    const result: CallOverrides = {};
    const networkId = await this.signer.getChainId();
    if (networkId === EthereumNetwork.Kovan) {
      result.gasPrice = 1000000000; // 1 gwei
    }
    return {
      ...overrides,
      ...result,
    };
  }

  public onProgress(callback: TransactionEventCallback): void {
    this.callbacks.push(callback);
  }

  get signer(): Signer {
    return this._signer;
  }
}
