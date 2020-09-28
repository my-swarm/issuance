import { ContractArtifacts } from '@lib/ContractArtifacts';
import { Contract, ContractFactory, Signer, Transaction, Event } from 'ethers';
import { EthereumNetwork, TransactionEventCallback, TransactionState } from '@types';

interface ContractOptions {
  gasPrice?: number;
  gasLimit?: number;
}

export class ContractProxy {
  private _signer: Signer;
  private callbacks: TransactionEventCallback[] = [];
  private state: TransactionState = TransactionState.None;

  constructor(signer: Signer) {
    this._signer = signer;
  }

  private handleStateChange(state: TransactionState): void {
    this.state = state;
    for (const callback of this.callbacks) {
      callback(state);
    }
  }

  public async deploy(artifacts: ContractArtifacts, args: Array<any> = []): Promise<Contract> {
    const contractFactory = new ContractFactory(artifacts.abi, artifacts.bytecode, this.signer);
    this.handleStateChange(TransactionState.Signing);
    const contractInstance = await contractFactory.deploy(...args, await this.getOptions());
    this.handleStateChange(TransactionState.Confirming);
    await contractInstance.deployTransaction.wait();
    this.handleStateChange(TransactionState.Confirmed);
    return contractInstance;
  }

  public async call(
    artifacts,
    method: string,
    args: Array<any> = [],
    events: { [index: string]: (event: Event) => void } = {},
  ): Promise<Transaction> {
    console.log('call', { artifacts, method, args, events });
    this.handleStateChange(TransactionState.None);
    const contract = new Contract(artifacts.address, artifacts.abi, this.signer);
    for (const [eventName, eventHandler] of Object.entries(events)) {
      contract.once(eventName, (oldValue, newValue) => eventHandler(newValue));
    }
    this.handleStateChange(TransactionState.Signing);
    const transaction = await contract[method](...args, await this.getOptions());
    this.handleStateChange(TransactionState.Confirming);
    await transaction.wait();
    this.handleStateChange(TransactionState.Confirmed);
    return transaction;
  }

  public async get(artifacts, method: string, args: Array<any> = []): Promise<any> {
    const contract = new Contract(artifacts.address, artifacts.abi, this.signer);
    return await contract[method](...args);
  }

  private async getOptions(): Promise<ContractOptions> {
    const result: ContractOptions = {};
    const networkId = await this.signer.getChainId();
    if (networkId === EthereumNetwork.Kovan) {
      result.gasPrice = 1000000000; // 1 gwei
    }
    return result;
  }

  public onProgress(callback: TransactionEventCallback): void {
    this.callbacks.push(callback);
  }

  get signer(): Signer {
    return this._signer;
  }
}
