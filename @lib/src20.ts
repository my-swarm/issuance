import { LocalToken, OnlineToken } from './localToken';
import dayjs from 'dayjs';
import { defaultAbiCoder } from '@ethersproject/abi';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { Block } from '@ethersproject/providers';

export enum Src20FeaturesBitmask {
  allowForceTransfer = 1,
  allowContractFreeze = 2,
  allowBurn = 4,
  allowAccountFreeze = 8,
  allowTransferRules = 16,
  allowAutoburn = 32,
}

export function getFeaturesAsContractValue(token: LocalToken): number {
  return (
    (token.allowForceTransfer ? Src20FeaturesBitmask.allowForceTransfer : 0) +
    (token.allowContractFreeze ? Src20FeaturesBitmask.allowContractFreeze : 0) +
    (token.allowBurn ? Src20FeaturesBitmask.allowBurn : 0) +
    (token.allowAccountFreeze ? Src20FeaturesBitmask.allowAccountFreeze : 0) +
    (token.allowTransferRules ? Src20FeaturesBitmask.allowTransferRules : 0) +
    (token.allowAutoburn ? Src20FeaturesBitmask.allowAutoburn : 0)
  );
}

export function getFeaturesOptionsAbiEncoded(token: LocalToken): string {
  if (token.allowAutoburn) {
    return defaultAbiCoder.encode(['uint256'], [dayjs(token.autoburnTs).unix()]);
  } else {
    return '0x00';
  }
}

export function tokenAutoburned(block: Block, token: OnlineToken): boolean {
  return token.features.autoburn && (!block || block?.timestamp >= token.features.autoburnTs);
}

export function tokenBalance(block: Block, token: OnlineToken, value: BigNumberish): BigNumber {
  if (tokenAutoburned(block, token)) {
    return BigNumber.from(0);
  }
  return BigNumber.from(value);
}
