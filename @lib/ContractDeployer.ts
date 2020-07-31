import { Contract } from './Contract';

export class ContractDeployer {
  private _contract: Contract;

  constructor(contract: Contract) {
    this._contract = contract;
  }
}
