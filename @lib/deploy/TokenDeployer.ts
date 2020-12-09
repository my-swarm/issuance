import { BigNumber, utils } from 'ethers';
import { AddressZero } from '@ethersproject/constants';

import { TokenDeployerState } from './common';
import { Deployer } from './Deployer';
import {
  parseUnits,
  getContractAddress,
  InvalidStateError,
  TransferRules,
  Src20FeaturesBitmask,
  tokenToKya,
  storeKya,
} from '..';

export class TokenDeployer extends Deployer {
  public async setup(): Promise<void> {
    await super.setup();
    this.state = TokenDeployerState.None;
  }

  public async deploy(): Promise<void> {
    await this.deployTransferRules();
    await this.deployFeatures();
    await this.deployRoles();
    await this.createToken();
    this.handleStateChange(TokenDeployerState.Finished);
  }

  private async deployTransferRules(): Promise<void> {
    if (this.token.transferRestrictionsType === TransferRules.None) {
      this._addresses.transferRules = AddressZero;
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
      getContractAddress('registry', this.networkId), // manager: the SRC20 registry contract
      this._addresses.transferRules || AddressZero, // rules
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

    const kya = tokenToKya(this.token);
    const { kyaHash, kyaUrl } = await storeKya(kya);

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
      parseUnits(supply, decimals),
      kyaHash,
      kyaUrl,
      assetNetValue,
      [
        this.getAddress('transferRules'),
        this.getAddress('roles'),
        this.getAddress('features'),
        this.getAddress('assetRegistry'),
        this.getAddress('minter'),
      ],
    ];
    return new Promise((resolve, reject) => {
      const events = {
        SRC20Created: (address) => {
          this.addresses.src20 = address;
          resolve();
        },
      };
      this.contractProxy.call('factory', 'create', params, events).catch((e) => reject(e));
    });
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
