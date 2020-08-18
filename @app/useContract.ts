import { Contract } from 'ethers';
import { contracts } from '@contracts';
import { ContractArtifacts } from '@lib';
import { useEthers } from './EthersContext';
import { Token } from '@types';

export function useContract(name: string, token?: Token): Contract {
  const { networkId, signer } = useEthers();
  const artifacts = new ContractArtifacts(contracts[name], networkId);
  let { address } = artifacts;
  if (!address) {
    if (!token) {
      throw new Error(`Require token for '${name}' contract`);
    }
    address = token.networks[networkId]?.addresses[name];
  }
  return new Contract(address, artifacts.abi, signer);
}
