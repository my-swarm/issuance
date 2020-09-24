import { Contract } from 'ethers';
import moment from 'moment';

import { FundraiserDeployerState } from '@types';
import { BASE_CURRENCIES } from '@const';

import { Deployer } from './Deployer';
import { getBnSupply } from './numberUtils';
import { getUnixTimestamp } from './dateUtils';

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
    console.log(fundraiser.startNow, startDate);
    const params = [
      fundraiser.label, // label
      this.addresses.src20, // token (address)
      getBnSupply(fundraiser.tokensToMint, decimals), // tokensToMint
      getUnixTimestamp(startDate), // startDate (int)
      getUnixTimestamp(fundraiser.endDate), // endDate (int)
      getBnSupply(fundraiser.softCap, decimals), // softCap
      getBnSupply(fundraiser.hardCap, decimals), // hardCap
    ];
    console.log('deploy fundraiser', params, startDate);
    this.handleStateChange(FundraiserDeployerState.Fundraiser);
    const instance = await this.contractProxy.deploy(this.getContractArtifacts('fundraiser'), params);
    this._addresses.fundraiser = instance.address;
    this.fundraiserContract = instance;
    console.log('fundraiser deployed', instance.address);
  }

  private async deployContributorRestrictions() {
    console.log('contributor restrictions');
    if (this.state > FundraiserDeployerState.ContributorRestrictions) return;

    this.handleStateChange(FundraiserDeployerState.ContributorRestrictions);
    const params = [
      this.addresses.fundraiser, // address fundraiseContract
      0, // uint maxNumContributors
      0, // minAmount
      0, // maxAmount
    ];
    const instance = await this.contractProxy.deploy(this.getContractArtifacts('contributorRestrictions'), params);
    this._addresses.contributorRestrictions = instance.address;
  }

  private async setupFundraiser() {
    console.log('setup fundraiser');
    if (this.state > FundraiserDeployerState.Setup) return;

    const { fundraiser } = this.token;
    this.handleStateChange(FundraiserDeployerState.Setup);
    const baseCurrency = BASE_CURRENCIES[fundraiser.baseCurrency];
    if (!baseCurrency) {
      throw new Error(`Base currency not defined: ${fundraiser.baseCurrency}`);
    }

    const tokenPrice = getBnSupply(fundraiser.tokenPrice || 0, baseCurrency.decimals);

    const args = [
      baseCurrency.addresses[this.networkId], // address _baseCurrency
      tokenPrice, // uint _tokenPrice
      this.getContractArtifacts('affiliateManager').address, // address _affiliateManager
      this._addresses.contributorRestrictions, // address _contributorRestrictions
      this.getContractArtifacts('getRateMinter').address, // address _minter
      fundraiser.contributionsLocked, // bool _contributionsLocked
    ];
    console.log('setupContract', args);
    const artifacts = this.getContractArtifacts('fundraiser');
    artifacts.address = this.fundraiserContract.address;
    await this.contractProxy.call(artifacts, 'setupContract', args);
  }
}
