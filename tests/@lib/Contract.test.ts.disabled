import { ContractArtifacts, RawContractArtifacts } from '@lib';
import { EthereumNetwork } from '@types';

const dummyArtifacts: RawContractArtifacts = {
  abi: [],
  bytecode: '0x123456',
  networks: {
    [EthereumNetwork.Ropsten]: {
      address: '0x1234123412341234123412341234123412341234',
    },
  },
};

test('creates instance', () => {
  const contract = new ContractArtifacts(dummyArtifacts, EthereumNetwork.Ropsten);
  expect(contract).toBeInstanceOf(ContractArtifacts);
  expect(contract.abi).toBe(dummyArtifacts.abi);
  expect(contract.bytecode).toBe(dummyArtifacts.bytecode);
  expect(contract.address).toBe(dummyArtifacts.networks[EthereumNetwork.Ropsten].address);
});
