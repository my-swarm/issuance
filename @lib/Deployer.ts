import { Signer } from 'ethers';
import { ContractProxy } from './ContractProxy';
import {
  EthereumAddress,
  EthereumNetwork,
  Token,
  DeployerEventCallback,
  TransactionEventCallback,
  DeployerState,
  TokenAddresses,
} from '@types';
import { ContractArtifacts } from './ContractArtifacts';
import { contracts } from '../@contracts';

export abstract class Deployer {
  protected contractAddresses: { [index: string]: EthereumAddress } = {}; // override the artifacts addresses
  protected _addresses: TokenAddresses;

  protected readonly signer: Signer;
  protected readonly contractProxy: ContractProxy;
  protected readonly token: Token;

  protected owner: EthereumAddress;
  protected networkId: EthereumNetwork;

  protected state: DeployerState;
  private callbacks: DeployerEventCallback[] = [];

  constructor(signer: Signer, token: Token) {
    this.signer = signer;
    this.contractProxy = new ContractProxy(signer);
    this.token = token;
  }

  public async setup(): Promise<void> {
    this.owner = await this.signer.getAddress();
    this.networkId = (await this.signer.getChainId()) as EthereumNetwork;
    this.addresses = this.token.networks[this.networkId]?.addresses || {};
  }

  public onProgress(callback: DeployerEventCallback): void {
    this.callbacks.push(callback);
  }

  protected handleStateChange(state: DeployerState): void {
    this.state = state;
    for (const callback of this.callbacks) {
      callback(state);
    }
  }

  public onTransactionProgress(callback: TransactionEventCallback): void {
    this.contractProxy.onProgress(callback);
  }

  public resume(state: DeployerState, addresses: TokenAddresses): void {
    this.state = state;
    this.addresses = addresses;
  }

  protected getContractArtifacts(contractName: string): ContractArtifacts {
    console.log('get artifacts', contractName);
    const artifacts = new ContractArtifacts(contracts[contractName], this.networkId);
    if (this.contractAddresses[contractName]) {
      artifacts.address = this.contractAddresses[contractName];
    }
    return artifacts;
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

  get addresses(): TokenAddresses {
    return this._addresses;
  }

  set addresses(addresses: TokenAddresses) {
    this._addresses = addresses;
  }
}
