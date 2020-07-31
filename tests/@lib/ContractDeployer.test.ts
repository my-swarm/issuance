import { Contract, ContractDeployer } from '@lib';

import GreeterArtifacts from '../resources/contracts/Greeter.json';

test('creates instance', () => {
  const contract = new Contract(GreeterArtifacts);
  const deployer = new ContractDeployer(contract);
  expect(deployer).toBeInstanceOf(ContractDeployer);
});
