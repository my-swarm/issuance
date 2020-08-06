import { ContractArtifacts, ContractProxy } from '@lib';
import { TransactionState } from '@types';
import * as ethers from 'ethers';
import * as ganache from 'ganache-cli';
import { GANACHE } from '../config';
import GreeterArtifacts from '../resources/contracts/Greeter.json';

const provider = new ethers.providers.Web3Provider(
  ganache.provider({
    mnemonic: GANACHE.mnemonic,
    port: GANACHE.port,
    hdPath: GANACHE.hdPath,
    network_id: GANACHE.networkId,
  }),
);

const account1 = GANACHE.accounts[0];
const account2 = GANACHE.accounts[1];
const wrongAccount = GANACHE.wrongAccount;

beforeAll(() => {
  //
});

function setupDeployer(account) {
  const wallet = new ethers.Wallet(account.privateKey, provider);
  const deployer = new ContractProxy(wallet);
  const contract = new ContractArtifacts(GreeterArtifacts, GANACHE.networkId);
  return { deployer, contract, wallet };
}

test('creates instance', () => {
  const wallet = new ethers.Wallet(account1.privateKey, provider);
  const deployer = new ContractProxy(wallet);
  expect(deployer).toBeInstanceOf(ContractProxy);
  expect(deployer.signer).toBe(wallet);
});

test('deploys contract', async () => {
  const { deployer, contract, wallet } = setupDeployer(account1);

  const eventsCalled: TransactionState[] = [];
  deployer.onProgress((event) => {
    eventsCalled.push(event);
  });

  const contractInstance = await deployer.deploy(contract, [account1.address]);
  expect(eventsCalled.length).toBe(3);
  const expectedEvents = [TransactionState.Signing, TransactionState.Confirming, TransactionState.Confirmed];
  for (const event of expectedEvents) {
    expect(eventsCalled).toContainEqual(event);
  }

  expect(contractInstance.address).toBeDefined();
  expect(ethers.utils.isAddress(contractInstance.address)).toBeTruthy();
  expect(contractInstance.signer).toBe(wallet);

  const tx = await contractInstance.setGreeting('Ahoj!');
  await tx.wait();
  const greeting = await contractInstance.greet();
  expect(greeting).toBe('Ahoj!');
});

test('does not deploy without eher', () => {
  const { deployer, contract } = setupDeployer(wrongAccount);
  expect(async () => {
    await deployer.deploy(contract, [wrongAccount.address]);
  }).rejects.toThrow("sender doesn't have enough funds to send tx.");
});
