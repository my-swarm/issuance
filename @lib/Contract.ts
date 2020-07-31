import { EthereumAbi, EthereumAddress, EthereumBytecode, EthereumNetwork } from '@types';

interface ContractArtifactsNetworks {
  [index: number]: {
    address: EthereumAddress;
  };
}

export interface ContractArtifacts {
  abi: EthereumAbi;
  bytecode: string;
  networks: ContractArtifactsNetworks;
}

export class Contract {
  private _abi: EthereumAbi;
  private _bytecode: EthereumBytecode;
  private _address: EthereumAddress;

  constructor(artifacts: ContractArtifacts, networkId: EthereumNetwork) {
    this._abi = artifacts.abi;
    this._bytecode = artifacts.bytecode;
    if (artifacts.networks && artifacts.networks[networkId]) {
      this._address = artifacts.networks[networkId].address;
    }
  }

  get abi() {
    return this._abi;
  }

  get bytecode() {
    return this._bytecode;
  }

  get address() {
    return this._address;
  }

  set address(address: EthereumAddress) {
    this._address = address;
  }
}
