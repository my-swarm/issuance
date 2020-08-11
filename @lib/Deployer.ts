import {
  DeployerEventCallback,
  DeployerState,
  EthereumAddress,
  EthereumNetwork,
  Src20FeaturesBitmask,
  Token,
  TokenAddresses,
  ZeroAddress,
} from '@types';
import { Contract, Signer, utils } from 'ethers';

import { contracts } from '../contracts';

import { ContractArtifacts, ContractProxy, InvalidStateError } from '.';

export class Deployer {
  private readonly _signer: Signer;
  private readonly _contractProxy: ContractProxy;
  private _token: Token;
  private state: DeployerState = DeployerState.None;
  private callbacks: DeployerEventCallback[] = [];
  private networkId: EthereumNetwork;
  private owner: EthereumAddress;
  private contractAddresses: { [index: string]: EthereumAddress } = {}; // override the artifacts addresses
  private _addresses: TokenAddresses = {
    transferRules: null,
    features: null,
    roles: null,
    token: null,
  };

  constructor(signer: Signer) {
    this._signer = signer;
    this._contractProxy = new ContractProxy(signer);
  }

  public async deploy(token: Token): Promise<void> {
    this.owner = await this._signer.getAddress();
    this.networkId = (await this._signer.getChainId()) as EthereumNetwork;

    this._token = token;
    if (token.deployerState) this.state = token.deployerState;
    if (token.addresses && token.addresses[this.networkId]) this.addresses = token.addresses[this.networkId];

    if (this.state < DeployerState.Started) {
      this.handleStateChange(DeployerState.Started);
    }
    await this.deployTransferRules();
    await this.deployFeatures();
    await this.deployRoles();
    await this.createToken();
    await this.approveStake();
    await this.mint();
    this.handleStateChange(DeployerState.Finished);
  }

  private async deployTransferRules(): Promise<void> {
    if (this.state >= DeployerState.TransferRulesFinished) return;
    if (this.state === DeployerState.Finished) {
      throw new InvalidStateError('Cannot deploy a finished contract.');
    }

    this.handleStateChange(DeployerState.TransferRulesStarted);
    const instance = await this._contractProxy.deploy(this.getContractArtifacts('transferRules'), [this.owner]);
    console.log('transferRules deployed at', instance.address);
    this._addresses.transferRules = instance.address;
    this.handleStateChange(DeployerState.TransferRulesFinished);
  }

  private async deployFeatures(): Promise<void> {
    if (this.state >= DeployerState.FeaturesFinished) return;

    this.handleStateChange(DeployerState.FeaturesStarted);
    const features = this.getFeaturesAsContractValue();
    const instance = await this._contractProxy.deploy(this.getContractArtifacts('features'), [this.owner, features]);
    console.log('features deployed at', instance.address);
    this._addresses.features = instance.address;
    this.handleStateChange(DeployerState.FeaturesFinished);
  }

  private async deployRoles(): Promise<void> {
    if (this.state >= DeployerState.RolesFinished) return;

    this.handleStateChange(DeployerState.RolesStarted);
    const instance = await this._contractProxy.deploy(this.getContractArtifacts('roles'), [
      this.owner,
      this.owner,
      this._addresses.features,
    ]);
    this._addresses.roles = instance.address;
    console.log('roles deployed at', instance.address);
    this.handleStateChange(DeployerState.RolesFinished);
  }

  private async createToken(): Promise<Contract> {
    if (this.state >= DeployerState.TokenFinished) return;

    this.handleStateChange(DeployerState.TokenStarted);
    const { name, symbol, decimals, initialSupply, assetNetValue } = this.token;
    const kyaHash = utils.formatBytes32String('abcd1234abcd1234');
    const kyaUrl = 'http://kya.com';
    const params = [
      name,
      symbol,
      decimals,
      initialSupply,
      kyaHash,
      kyaUrl,
      assetNetValue,
      [
        this.owner,
        ZeroAddress, // restrictions - not implemented (yet?)
        this.addresses.transferRules,
        this.addresses.roles,
        this.addresses.features,
        this.getContractArtifacts('assetRegistry').address,
        this.getContractArtifacts('getRateMinter').address,
      ],
    ];
    console.log('deploying using factory', params);
    console.log('deploying with params', params);
    return new Promise((resolve, reject) => {
      try {
        const events = {
          SRC20Created: (token) => {
            this.handleStateChange(DeployerState.TokenFinished);
            this.addresses.token = token.address;
            resolve(token);
          },
        };
        this.contractProxy.call(this.getContractArtifacts('factory'), 'create', params, events);
      } catch (e) {
        reject(e);
      }
    });
  }

  private async approveStake(): Promise<void> {
    if (this.state >= DeployerState.StakeApproveFinished) return;

    this.handleStateChange(DeployerState.StakeApproveStarted);
    const spender = this.getContractArtifacts('registry').address;
    const value = await this.contractProxy.get(this.getContractArtifacts('getRateMinter'), 'calcStake', [
      this.token.assetNetValue,
    ]);
    console.log('approving', { spender, value });
    await this.contractProxy.call(this.getContractArtifacts('swmToken'), 'approve', [spender, value]);
    this.handleStateChange(DeployerState.StakeApproveFinished);
  }

  private async mint(): Promise<void> {
    if (this.state >= DeployerState.MintFinished) return;

    this.handleStateChange(DeployerState.MintStarted);
    const tokenAddress = this.addresses.token;
    const totalSupply = this.token.initialSupply; // todo: convert to 'wei'
    console.log('stake and mint', [tokenAddress, totalSupply]);
    await this.contractProxy.call(this.getContractArtifacts('getRateMinter'), 'stakeAndMint', [
      tokenAddress,
      totalSupply,
    ]);
    this.handleStateChange(DeployerState.MintFinished);
  }

  public onProgress(callback: DeployerEventCallback): void {
    this.callbacks.push(callback);
  }

  private handleStateChange(state: DeployerState): void {
    this.state = state;
    for (const callback of this.callbacks) {
      callback(state);
    }
  }

  get token(): Token {
    return this._token;
  }

  get signer(): Signer {
    return this._signer;
  }

  get contractProxy(): ContractProxy {
    return this._contractProxy;
  }

  get addresses(): TokenAddresses {
    return this._addresses;
  }

  set addresses(addresses: TokenAddresses) {
    this._addresses = addresses;
  }

  public resume(state: DeployerState, addresses: TokenAddresses) {
    if (state) {
      this.state = state;
    }
    if (addresses) {
      this.addresses = addresses;
    }
  }

  private getContractArtifacts(contractName: string): ContractArtifacts {
    const artifacts = new ContractArtifacts(contracts[contractName], this.networkId);
    if (this.contractAddresses[contractName]) {
      console.log(`using explicit address for ${contractName}: ${this.contractAddresses[contractName]}`);
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
    console.log('setting address', contractName, address);
    this.contractAddresses[contractName] = address;
  }

  private getFeaturesAsContractValue(): number {
    return (
      (this.token.allowForceTransfer ? Src20FeaturesBitmask.allowForceTransfer : 0) +
      (this.token.allowContractFreeze ? Src20FeaturesBitmask.allowContractFreeze : 0) +
      (this.token.allowBurn ? Src20FeaturesBitmask.allowBurn : 0) +
      (this.token.allowAccountFreeze ? Src20FeaturesBitmask.allowAccountFreeze : 0)
    );
  }
}
