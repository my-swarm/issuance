import { Contract, ContractFactory, Signer } from 'ethers';
import { abis, addresses, bytecodes, contractsMeta, contractNameMap } from '@contracts';
import { Token } from '@types';

function getFullName(contractName: string): string {
  if (!contractNameMap[contractName]) throw new Error('Unknown contract: ' + contractName);
  return contractNameMap[contractName];
}

export function getContractAbi(contractName: string): any {
  contractName = getFullName(contractName);
  const abi = abis[contractName];
  if (!abi) throw new Error(`ABI for '${contractName}' not found`);
  return abi;
}

export function getContractAddress(
  contractName: string,
  networkId: number | string,
  token?: Token,
): string | undefined {
  contractName = getFullName(contractName);
  const addrs = addresses[networkId];
  if (!addrs) throw new Error(`Addresses for network '${networkId}' not found`);
  const contractMeta = contractsMeta[contractName];
  let address = addrs[contractName];
  if (!address && token && !contractMeta.isBase) {
    address = token.networks[networkId].addresses[contractMeta.shortName];
  }
  return address || undefined;
}

export function getContractBytecode(contractName: string): string {
  contractName = getFullName(contractName);
  const bytecode = bytecodes[contractName];
  if (!bytecode) throw new Error(`Bytecode for '${contractName}' not found`);
  return bytecode;
}

export function getContract(contractName: string, signer: Signer, networkId: string | number, token?: Token): Contract {
  const address = getContractAddress(contractName, networkId, token);
  if (!address) return undefined;
  return new Contract(address, getContractAbi(contractName), signer);
}

export function getContractFactory(contractName: string, signer: Signer): ContractFactory {
  return new ContractFactory(getContractAbi(contractName), getContractBytecode(contractName), signer);
}
