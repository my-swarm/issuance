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
  Local = -1,
}
