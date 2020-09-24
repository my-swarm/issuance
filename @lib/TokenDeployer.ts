import {
  TokenDeployerState,
  Src20FeaturesBitmask,
  TokenAddresses,
  TokenState,
  TransferRules,
  zeroAddress,
  DeployerState,
} from '@types';
import { BigNumber, utils } from 'ethers';

import { Deployer, getBnSupply, InvalidStateError } from '.';
import assert from 'assert';

export class TokenDeployer extends Deployer {
  public async setup(): Promise<void> {
    await super.setup();
    this.state = TokenDeployerState.None;
  }

  public async deploy(): Promise<void> {
    // if (this.state > TokenDeployerState.None) {
    //   this.handleStateChange(TokenDeployerState.None);
    // }
    await this.deployTransferRules();
    await this.deployFeatures();
    await this.deployRoles();
    await this.createToken();
    this.handleStateChange(TokenDeployerState.Finished);
  }

  private async deployTransferRules(): Promise<void> {
    if (this.token.transferRestrictionsType === TransferRules.None) return;
    if (this.state > TokenDeployerState.TransferRules) return;
    if (this.state === TokenDeployerState.Finished) {
      throw new InvalidStateError('Cannot deploy a finished contract.');
    }

    this.handleStateChange(TokenDeployerState.TransferRules);
    const instance = await this.contractProxy.deploy(this.getContractArtifacts('transferRules'), [this.owner]);
    this._addresses.transferRules = instance.address;
  }

  private async deployFeatures(): Promise<void> {
    if (this.state > TokenDeployerState.Features) return;

    this.handleStateChange(TokenDeployerState.Features);
    const features = this.getFeaturesAsContractValue();
    const instance = await this.contractProxy.deploy(this.getContractArtifacts('features'), [this.owner, features]);
    this._addresses.features = instance.address;
  }

  private async deployRoles(): Promise<void> {
    if (this.state > TokenDeployerState.Roles) return;
    const registryAddress = this.getContractArtifacts('registry').address;

    this.handleStateChange(TokenDeployerState.Roles);
    const instance = await this.contractProxy.deploy(this.getContractArtifacts('roles'), [
      this.owner, // owner
      registryAddress, // manager: the SRC20 registry contract
      this._addresses.transferRules || zeroAddress, // rules
    ]);
    this._addresses.roles = instance.address;
  }

  private async createToken(): Promise<void> {
    if (this.state > TokenDeployerState.Token) return;

    this.handleStateChange(TokenDeployerState.Token);
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
        zeroAddress, // restrictions - not implemented (yet?)
        this.addresses.transferRules || zeroAddress,
        this.addresses.roles,
        this.addresses.features,
        this.getContractArtifacts('assetRegistry').address,
        this.getContractArtifacts('getRateMinter').address,
      ],
    ];
    return new Promise((resolve, reject) => {
      const events = {
        SRC20Created: (event) => {
          const { args } = event;
          this.addresses.src20 = args.token;
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
    if (currentlyApproved.lt(stakeAmount)) {
      const result = await this.contractProxy.call(swmTokenArtifacts, 'approve', [
        registryAddress, // param: spender
        stakeAmount.sub(currentlyApproved), // param: value
      ]);
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

  private getFeaturesAsContractValue(): number {
    return (
      (this.token.allowForceTransfer ? Src20FeaturesBitmask.allowForceTransfer : 0) +
      (this.token.allowContractFreeze ? Src20FeaturesBitmask.allowContractFreeze : 0) +
      (this.token.allowBurn ? Src20FeaturesBitmask.allowBurn : 0) +
      (this.token.allowAccountFreeze ? Src20FeaturesBitmask.allowAccountFreeze : 0)
    );
  }
}
