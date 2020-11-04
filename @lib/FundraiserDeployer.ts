import { Contract } from 'ethers';
import moment from 'moment';

import { FundraiserDeployerState } from '@types';
import { BASE_CURRENCIES } from '@const';

import { Deployer } from './Deployer';
import { parseUnits } from './numberUtils';
import { getUnixTimestamp } from './dateUtils';

const baseCurrency = BASE_CURRENCIES.USDC;

export class FundraiserDeployer extends Deployer {
  private fundraiserContract: Contract;

  public async setup(): Promise<void> {
    await super.setup();
    this.state = FundraiserDeployerState.None;
  }

  public async deploy(): Promise<void> {
    await this.deployFundraiser();
    await this.deployContributorRestrictions();
    await this.setupFundraiser();
    this.handleStateChange(FundraiserDeployerState.Finished);
  }

  private async deployFundraiser() {
    if (this.state > FundraiserDeployerState.Fundraiser) return;
    const { fundraiser } = this.token;
    const { decimals } = this.token;
    const startDate = fundraiser.startNow ? moment().add(1, 'minute') : fundraiser.startDate;
    const params = [
      fundraiser.label, // label
      this.addresses.src20, // token (address)
      parseUnits(fundraiser.tokensToMint, decimals), // tokensToMint
      getUnixTimestamp(startDate), // startDate (int)
      getUnixTimestamp(fundraiser.endDate), // endDate (int)
      parseUnits(fundraiser.softCap, baseCurrency.decimals), // softCap
      parseUnits(fundraiser.hardCap, baseCurrency.decimals), // hardCap
    ];
    this.handleStateChange(FundraiserDeployerState.Fundraiser);
    const instance = await this.contractProxy.deploy('fundraiser', params);
    this._addresses.fundraiser = instance.address;
    this.fundraiserContract = instance;
  }

  private async deployContributorRestrictions() {
    if (this.state > FundraiserDeployerState.ContributorRestrictions) return;

    this.handleStateChange(FundraiserDeployerState.ContributorRestrictions);
    const params = [
      this.addresses.fundraiser, // address fundraiseContract
      0, // uint maxNumContributors
      0, // minAmount
      0, // maxAmount
    ];
    const instance = await this.contractProxy.deploy('contributorRestrictions', params);
    this._addresses.contributorRestrictions = instance.address;
  }

  private async setupFundraiser() {
    if (this.state > FundraiserDeployerState.Setup) return;

    const { fundraiser } = this.token;
    this.handleStateChange(FundraiserDeployerState.Setup);
    const baseCurrency = BASE_CURRENCIES[fundraiser.baseCurrency];
    if (!baseCurrency) {
      throw new Error(`Base currency not defined: ${fundraiser.baseCurrency}`);
    }

    const tokenPrice = parseUnits(fundraiser.tokenPrice || 0, baseCurrency.decimals);

    const args = [
      baseCurrency.addresses[this.networkId], // address _baseCurrency
      tokenPrice, // uint _tokenPrice
      this.getAddress('affiliateManager'), // address _affiliateManager
      this.getAddress('contributorRestrictions'), // address _contributorRestrictions
      this.getAddress('minter'), // address _minter
      fundraiser.contributionsLocked, // bool _contributionsLocked
    ];
    await this.contractProxy.call('fundraiser', 'setup', args);
  }
}
