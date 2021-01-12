import { Contract } from '@ethersproject/contracts';
import dayjs from 'dayjs';

import { BASE_CURRENCIES, EthereumToken, LocalFundraiser } from '@lib';

import { parseUnits, getUnixTimestamp, DeployerState } from '..';
import { Deployer } from '.';

export class FundraiserDeployer extends Deployer {
  private fundraiser: LocalFundraiser;
  private tokenDecimals: number;
  private tokenAddress: string;
  private fundraiserContract: Contract;
  private baseCurrency: EthereumToken;

  public async setup(fundraiser?: LocalFundraiser, tokenAddress?: string, tokenDecimals?: number): Promise<void> {
    this.fundraiser = fundraiser;
    this.tokenAddress = tokenAddress;
    this.tokenDecimals = tokenDecimals;
    this.baseCurrency = BASE_CURRENCIES[fundraiser.baseCurrency];
    if (!this.baseCurrency) {
      throw new Error(`Base currency not defined: ${fundraiser.baseCurrency}`);
    }
    await super.setup();
  }

  public async deploy(): Promise<void> {
    await this.deployFundraiser();
    await this.deployContributorRestrictions();
    await this.deployAffiliateManager();
    await this.setupFundraiser();
    this.handleStateChange(DeployerState.Finished);
  }

  private async deployFundraiser() {
    if (this.state > DeployerState.Fundraiser) return;
    const { fundraiser, tokenDecimals, baseCurrency } = this;
    const startDate = fundraiser.startNow ? dayjs().add(1, 'minute') : fundraiser.startDate;
    const params = [
      fundraiser.label, // label
      this.tokenAddress, // token (address)
      parseUnits(fundraiser.tokensToMint, tokenDecimals), // tokensToMint
      getUnixTimestamp(startDate), // startDate (int)
      getUnixTimestamp(fundraiser.endDate), // endDate (int)
      parseUnits(fundraiser.softCap, baseCurrency.decimals), // softCap
      parseUnits(fundraiser.hardCap, baseCurrency.decimals), // hardCap
    ];
    this.handleStateChange(DeployerState.Fundraiser);
    const instance = await this.contractProxy.deploy('fundraiser', params);
    this.addresses.fundraiser = instance.address;
    this.fundraiserContract = instance;
  }

  private async deployContributorRestrictions() {
    if (this.state > DeployerState.ContributorRestrictions) return;

    this.handleStateChange(DeployerState.ContributorRestrictions);
    const params = [
      this.addresses.fundraiser, // address fundraiseContract
      0, // uint maxNumContributors
      0, // minAmount
      0, // maxAmount
    ];
    const instance = await this.contractProxy.deploy('contributorRestrictions', params);
    this.addresses.contributorRestrictions = instance.address;
  }

  private async deployAffiliateManager() {
    if (this.state > DeployerState.AffiliateManager) return;
    this.handleStateChange(DeployerState.AffiliateManager);
    const instance = await this.contractProxy.deploy('affiliateManager');
    this.addresses.affiliateManager = instance.address;
  }

  private async setupFundraiser() {
    if (this.state > DeployerState.Setup) return;

    const { fundraiser, baseCurrency } = this;
    this.handleStateChange(DeployerState.Setup);

    const tokenPrice = parseUnits(fundraiser.tokenPrice || 0, baseCurrency.decimals);

    const args = [
      baseCurrency.addresses[this.networkId], // address _baseCurrency
      tokenPrice, // uint _tokenPrice
      this.getAddress('affiliateManager'), // address _affiliateManager
      this.getAddress('contributorRestrictions'), // address _contributorRestrictions
      this.getAddress('fundraiserManager'), // address _fundraiserManager
      this.getAddress('minter'), // address _minter
      fundraiser.contributionsLocked, // bool _contributionsLocked
    ];
    await this.contractProxy.call(['fundraiser', this.addresses.fundraiser], 'setup', args);
  }
}
