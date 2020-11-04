import { Contract, ContractFactory, Signer, Transaction, Event } from 'ethers';
import { EthereumNetwork, Token, TransactionEventCallback, TransactionState } from '@types';
import { getContractFactory, getContract, getContractAbi } from './contracts';

interface ContractOptions {
  gasPrice?: number;
  gasLimit?: number;
}

export class ContractProxy {
  private _signer: Signer;
  private _token: Token;
  private callbacks: TransactionEventCallback[] = [];
  private state: TransactionState = TransactionState.None;

  constructor(signer: Signer, token?: Token) {
    this._signer = signer;
    this._token = token;
  }

  private handleStateChange(state: TransactionState): void {
    this.state = state;
    for (const callback of this.callbacks) {
      callback(state);
    }
  }

  public async deploy(contractName: string, args: Array<any> = []): Promise<Contract> {
    const contractFactory = getContractFactory(contractName, this.signer);
    this.handleStateChange(TransactionState.Signing);
    const contractInstance = await contractFactory.deploy(...args, await this.getOptions());
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
  ): Promise<Transaction> {
    this.handleStateChange(TransactionState.None);
    let contract;
    if (typeof contractName === 'string') {
      contract = getContract(contractName, this.signer, await this.signer.getChainId(), this._token);
    } else {
      contract = new Contract(contractName[1], getContractAbi(contractName[0]), this.signer);
    }
    console.log({ contractName, contract });
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

  public async get(contractName: string, method: string, args: Array<any> = []): Promise<any> {
    const contract = getContract(contractName, this.signer, await this.signer.getChainId());
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
