import {
  DeployerEventCallback,
  DeployerState,
  EthereumAddress,
  EthereumNetwork,
  Src20FeaturesBitmask,
  Token,
  TokenAddresses,
  TokenState,
  TransactionEventCallback,
  ZeroAddress,
} from '@types';
import { BigNumber, Contract, Signer, utils } from 'ethers';

import { ContractProxy, InvalidStateError, ContractArtifacts, getBnSupply } from '.';
import { contracts } from '@contracts';
import assert from 'assert';

export class Deployer {
  private readonly signer: Signer;
  private readonly contractProxy: ContractProxy;
  private readonly token: Token;
  private state: DeployerState = DeployerState.None;
  private callbacks: DeployerEventCallback[] = [];
  private contractAddresses: { [index: string]: EthereumAddress } = {}; // override the artifacts addresses
  private owner: EthereumAddress;
  private networkId: EthereumNetwork;

  private _addresses: TokenAddresses = {
    transferRules: null,
    features: null,
    roles: null,
    src20: null,
  };

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

  public async deploy(): Promise<void> {
    if (this.state > DeployerState.None) {
      this.handleStateChange(DeployerState.None);
    }
    await this.deployTransferRules();
    await this.deployFeatures();
    await this.deployRoles();
    await this.createToken();
    console.log('deployed');
    this.handleStateChange(DeployerState.Finished);
  }

  private async deployTransferRules(): Promise<void> {
    if (this.state > DeployerState.TransferRules) return;
    if (this.state === DeployerState.Finished) {
      throw new InvalidStateError('Cannot deploy a finished contract.');
    }

    this.handleStateChange(DeployerState.TransferRules);
    const instance = await this.contractProxy.deploy(this.getContractArtifacts('transferRules'), [this.owner]);
    this._addresses.transferRules = instance.address;
  }

  private async deployFeatures(): Promise<void> {
    if (this.state > DeployerState.Features) return;

    this.handleStateChange(DeployerState.Features);
    const features = this.getFeaturesAsContractValue();
    const instance = await this.contractProxy.deploy(this.getContractArtifacts('features'), [this.owner, features]);
    this._addresses.features = instance.address;
  }

  private async deployRoles(): Promise<void> {
    if (this.state > DeployerState.Roles) return;
    const registryAddress = this.getContractArtifacts('registry').address;

    this.handleStateChange(DeployerState.Roles);
    const instance = await this.contractProxy.deploy(this.getContractArtifacts('roles'), [
      this.owner, // owner
      registryAddress, // manager: the SRC20 registry contract
      this._addresses.transferRules, // rules
    ]);
    this._addresses.roles = instance.address;
  }

  private async createToken(): Promise<void> {
    if (this.state > DeployerState.Token) return;

    this.handleStateChange(DeployerState.Token);
    const {
      name,
      symbol,
      decimals,
      initialSupply,
      allowUnlimitedSupply,
      totalSupply,
      allowMint,
      assetNetValue,
    } = this.token;
    const kyaHash = utils.formatBytes32String('abcd1234abcd1234');
    const kyaUrl = 'http://kya.com';
    let supply = initialSupply;
    if (allowMint) {
      if (allowUnlimitedSupply) {
        supply = 0;
      } else if (totalSupply > initialSupply) {
        supply = totalSupply;
      }
    }

    console.log({ allowMint, initialSupply, totalSupply, allowUnlimitedSupply, supply });
    const params = [
      name,
      symbol,
      decimals,
      getBnSupply(supply, decimals),
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
    // console.log({ params });
    return new Promise((resolve, reject) => {
      const events = {
        SRC20Created: (event) => {
          const { args } = event;
          this.addresses.src20 = args.token;
          console.log('resolve');
          resolve();
        },
      };
      this.contractProxy.call(this.getContractArtifacts('factory'), 'create', params, events).catch((e) => reject(e));
    });
  }

  public async stakeAndMint(): Promise<void> {
    const canMint = this.token.networks[this.networkId]?.state === TokenState.Deployed;
    assert(canMint, "Cannot mint a token that's not deplyed");

    await this.approveStake();
    await this.mint();
  }

  private async approveStake(): Promise<void> {
    const registryAddress = this.getContractArtifacts('registry').address;
    const stakeAmount = await this.getStakeAmount();
    const swmTokenArtifacts = this.getContractArtifacts('swmToken');
    const owner = await this.signer.getAddress();
    const currentlyApproved = await this.contractProxy.get(swmTokenArtifacts, 'allowance', [owner, registryAddress]);
    console.log({ currentlyApproved: currentlyApproved.toString(), stakeAmount: stakeAmount.toString() });
    if (currentlyApproved.lt(stakeAmount)) {
      console.log('approving', stakeAmount.sub(currentlyApproved).toString());
      const result = await this.contractProxy.call(swmTokenArtifacts, 'approve', [
        registryAddress, // param: spender
        stakeAmount.sub(currentlyApproved), // param: value
      ]);
      console.log({ result });
      const currentlyApproved2 = await this.contractProxy.get(swmTokenArtifacts, 'allowance', [owner, registryAddress]);
      console.log('approved potom', currentlyApproved2.toString());
    }
  }

  public async getStakeAmount(): Promise<BigNumber> {
    return await this.contractProxy.get(this.getContractArtifacts('getRateMinter'), 'calcStake', [
      this.token.assetNetValue,
    ]);
  }

  private async mint(): Promise<void> {
    const params = [
      this.addresses.src20, // param: src20
      getBnSupply(this.token.initialSupply, this.token.decimals), // param: numSRC20TOkens
    ];
    await this.contractProxy.call(this.getContractArtifacts('getRateMinter'), 'stakeAndMint', params);
  }

  public onProgress(callback: DeployerEventCallback): void {
    this.callbacks.push(callback);
  }

  public onTransactionProgress(callback: TransactionEventCallback): void {
    this.contractProxy.onProgress(callback);
  }

  private handleStateChange(state: DeployerState): void {
    this.state = state;
    for (const callback of this.callbacks) {
      callback(state);
    }
  }

  public resume(state: DeployerState, addresses: TokenAddresses): void {
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

  private getFeaturesAsContractValue(): number {
    return (
      (this.token.allowForceTransfer ? Src20FeaturesBitmask.allowForceTransfer : 0) +
      (this.token.allowContractFreeze ? Src20FeaturesBitmask.allowContractFreeze : 0) +
      (this.token.allowBurn ? Src20FeaturesBitmask.allowBurn : 0) +
      (this.token.allowAccountFreeze ? Src20FeaturesBitmask.allowAccountFreeze : 0)
    );
  }

  get addresses(): TokenAddresses {
    return this._addresses;
  }

  set addresses(addresses: TokenAddresses) {
    this._addresses = addresses;
  }
}
