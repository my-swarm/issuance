import { Signer } from '@ethersproject/abstract-signer';
import { EthereumAddress, EthereumNetwork } from '@lib';

import { ContractProxy, getContractAddress, LocalToken, LocalTokenAddresses, TransactionEventCallback } from '..';
import { DeployerState } from './common';

export type DeployerEventCallback = (deployer: Deployer) => void;

export abstract class Deployer {
  public addresses: LocalTokenAddresses;
  protected contractAddresses: { [index: string]: EthereumAddress } = {}; // overrides of base contracts
  protected networkId: EthereumNetwork;

  protected readonly signer: Signer;
  protected readonly contractProxy: ContractProxy;

  protected owner: EthereumAddress;

  public state: DeployerState;
  private callbacks: DeployerEventCallback[] = [];

  constructor(signer: Signer, addresses: LocalTokenAddresses) {
    this.state = DeployerState.None;
    this.signer = signer;
    this.contractProxy = new ContractProxy(signer);
    this.addresses = addresses;
  }

  public async setup(): Promise<void> {
    this.owner = await this.signer.getAddress();
    this.networkId = await this.signer.getChainId();
  }

  public onProgress(callback: DeployerEventCallback): void {
    this.callbacks.push(callback);
  }

  protected handleStateChange(state: DeployerState): void {
    this.state = state;
    for (const callback of this.callbacks) {
      callback(this);
    }
  }

  public onTransactionProgress(callback: TransactionEventCallback): void {
    this.contractProxy.onProgress(callback);
  }

  public resume(state: DeployerState, addresses: LocalTokenAddresses): void {
    console.log('resume', state);
    this.state = state;
    this.addresses = addresses;
  }

  /**
   * Normally the address is read from the artifacts file. But we might want to override that (e.g. when testing).
   * @param contractName
   * @param address
   */
  public setContractAddress(contractName: string, address: EthereumAddress): void {
    this.contractAddresses[contractName] = address;
  }

  public abstract async deploy(): Promise<void>;

  public getAddress(contractName: string): string {
    return (
      this.addresses[contractName] ||
      this.contractAddresses[contractName] ||
      getContractAddress(contractName, this.networkId)
    );
  }
}
