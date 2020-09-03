export type Uuid = string;
export type EthereumAddress = string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EthereumAbi = Array<any>;
export type EthereumBytecode = string;

export enum EthereumNetwork {
  Unknown = 0,
  Main = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
  Local = 1337, // there's a bug in ganache and it's always 1337. Don't change it here mate!
}

export enum Src20FeaturesBitmask {
  allowForceTransfer = 1,
  allowContractFreeze = 2,
  allowBurn = 4,
  allowAccountFreeze = 8,
}

export const zeroAddress = '0x0000000000000000000000000000000000000000';
