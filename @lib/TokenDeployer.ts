import { TokenDeployerState, Src20FeaturesBitmask, TokenState, TransferRules, zeroAddress } from '@types';
import { BigNumber, utils } from 'ethers';

import { Deployer, getBnSupply, getContractAddress, InvalidStateError } from '.';
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
    if (this.token.transferRestrictionsType === TransferRules.None) {
      this._addresses.transferRules = zeroAddress;
      return;
    }
    if (this.state > TokenDeployerState.TransferRules) return;
    if (this.state === TokenDeployerState.Finished) {
      throw new InvalidStateError('Cannot deploy a finished contract.');
    }

    this.handleStateChange(TokenDeployerState.TransferRules);
    const instance = await this.contractProxy.deploy('transferRules', [this.owner]);
    this._addresses.transferRules = instance.address;
  }

  private async deployFeatures(): Promise<void> {
    if (this.state > TokenDeployerState.Features) return;

    this.handleStateChange(TokenDeployerState.Features);
    const features = this.getFeaturesAsContractValue();
    const instance = await this.contractProxy.deploy('features', [this.owner, features]);
    this._addresses.features = instance.address;
  }

  private async deployRoles(): Promise<void> {
    if (this.state > TokenDeployerState.Roles) return;

    this.handleStateChange(TokenDeployerState.Roles);
    const instance = await this.contractProxy.deploy('roles', [
      this.owner, // owner
      getContractAddress('registry', this.networkId), // manager: the SRC20 registry contract
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
        this.getAddress('transferRules'),
        this.getAddress('roles'),
        this.getAddress('features'),
        this.getAddress('assetRegistry'),
        this.getAddress('minter'),
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
      this.contractProxy.call('factory', 'create', params, events).catch((e) => reject(e));
    });
  }

  public async stakeAndMint(): Promise<void> {
    const canMint = this.token.networks[this.networkId]?.state === TokenState.Deployed;
    assert(canMint, "Cannot mint a token that's not deplyed");

    await this.approveStake();
    await this.mint();
  }

  private async approveStake(): Promise<void> {
    const registryAddress = this.getAddress('registry');
    const stakeAmount = await this.getStakeAmount();
    const owner = await this.signer.getAddress();
    const currentlyApproved = await this.contractProxy.get('swmToken', 'allowance', [owner, registryAddress]);
    if (currentlyApproved.lt(stakeAmount)) {
      await this.contractProxy.call('swmToken', 'approve', [
        registryAddress, // param: spender
        stakeAmount.sub(currentlyApproved), // param: value
      ]);
    }
  }

  public async getStakeAmount(): Promise<BigNumber> {
    return await this.contractProxy.get('minter', 'calcStake', [this.token.assetNetValue]);
  }

  private async mint(): Promise<void> {
    const params = [
      this.addresses.src20, // param: src20
      getBnSupply(this.token.initialSupply, this.token.decimals), // param: numSRC20TOkens
    ];
    await this.contractProxy.call('minter', 'stakeAndMint', params);
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
