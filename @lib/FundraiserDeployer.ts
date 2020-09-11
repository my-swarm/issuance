import { FundraiserDeployerState, TokenDeployerState } from '@types';
import { Deployer } from './Deployer';
import { getBnSupply } from './numberUtils';
import { getUnixTimestamp } from './dateUtils';

export class FundraiserDeployer extends Deployer {
  public async setup(): Promise<void> {
    await super.setup();
    this.state = FundraiserDeployerState.None;
  }

  public async deploy(): Promise<void> {
    await this.deployFundraiser();
    await this.deployContributorRestrictions();
    await this.setupFundraiser();
    this.handleStateChange(TokenDeployerState.Finished);
  }

  private async deployFundraiser() {
    if (this.state > FundraiserDeployerState.Fundraiser) return;
    this.handleStateChange(FundraiserDeployerState.Fundraiser);
    const { fundraiser } = this.token;

    const { decimals } = this.token;
    const instance = await this.contractProxy.deploy(this.getContractArtifacts('fundraiser'), [
      fundraiser.label, // label
      this.addresses.src20, // token (address)
      getBnSupply(fundraiser.tokensToMint, decimals), // tokensToMint
      getUnixTimestamp(fundraiser.startDate), // startDate (int)
      getUnixTimestamp(fundraiser.endDate), // endDate (int)
      getBnSupply(fundraiser.softCap, decimals), // softCap
      getBnSupply(fundraiser.hardCap, decimals), // hardCap
    ]);
    console.log('fundraiser deployed', instance.address);
  }

  private async deployContributorRestrictions() {}

  private async setupFundraiser() {}
}
