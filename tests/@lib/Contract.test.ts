import { Contract } from '@lib/ContractDeployer';
import { ContractArtifacts } from '@lib/Contract';
import { EthereumNetwork } from '@types';

const dummyArtifacts: ContractArtifacts = {
  abi: [],
  bytecode: '0x123456',
  networks: {
    [EthereumNetwork.Ropsten]: {
      address: '0x1234123412341234123412341234123412341234',
    },
  },
};

test('creates instance', () => {
  const contract = new Contract(dummyArtifacts);
  expect(contract).toBeInstanceOf(Contract);
  expect(contract.abi).toBe(dummyArtifacts.abi);
  expect(contract.bytecode).toBe(dummyArtifacts.bytecode);
  expect(contract.address).toBe(dummyArtifacts.networks[EthereumNetwork.Ropsten].address);
});
