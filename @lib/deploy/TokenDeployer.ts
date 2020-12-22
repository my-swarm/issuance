import { AddressZero } from '@ethersproject/constants';

import { DeployerState } from './common';
import { Deployer } from './Deployer';
import {
  parseUnits,
  getContractAddress,
  InvalidStateError,
  TransferRules,
  Src20FeaturesBitmask,
  tokenToKya,
  storeKya,
  LocalToken,
} from '..';

export class TokenDeployer extends Deployer {
  private token: LocalToken;

  public async setup(token?: LocalToken): Promise<void> {
    await super.setup();
    this.token = token;
  }

  public async deploy(): Promise<void> {
    await this.deployTransferRules();
    await this.deployFeatures();
    await this.deployRoles();
    await this.createToken();
    this.handleStateChange(DeployerState.Finished);
  }

  private async deployTransferRules(): Promise<void> {
    if (this.token.transferRestrictionsType === TransferRules.None) {
      this.addresses.transferRules = AddressZero;
      return;
    }
    if (this.state > DeployerState.TransferRules) return;
    if (this.state === DeployerState.Finished) {
      throw new InvalidStateError('Cannot deploy a finished contract.');
    }

    this.handleStateChange(DeployerState.TransferRules);
    const instance = await this.contractProxy.deploy('transferRules', [this.owner]);
    this.addresses.transferRules = instance.address;
  }

  private async deployFeatures(): Promise<void> {
    if (this.state > DeployerState.Features) return;

    this.handleStateChange(DeployerState.Features);
    const features = this.getFeaturesAsContractValue();
    const instance = await this.contractProxy.deploy('features', [this.owner, features]);
    this.addresses.features = instance.address;
  }

  private async deployRoles(): Promise<void> {
    if (this.state > DeployerState.Roles) return;

    this.handleStateChange(DeployerState.Roles);
    const instance = await this.contractProxy.deploy('roles', [
      getContractAddress('registry', this.networkId), // manager: the SRC20 registry contract
      this.addresses.transferRules || AddressZero, // rules
    ]);
    this.addresses.roles = instance.address;
  }

  private async createToken(): Promise<void> {
    if (this.state > DeployerState.Token) return;

    this.handleStateChange(DeployerState.Token);
    const { name, symbol, decimals, allowUnlimitedSupply, totalSupply, allowMint, assetNetValue } = this.token;

    const kya = tokenToKya(this.token);
    const { kyaHash, kyaUrl } = await storeKya(kya);

    let supply = totalSupply;
    if (!supply || allowUnlimitedSupply) {
      supply = 0;
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
