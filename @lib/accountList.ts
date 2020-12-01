import { ethers } from 'ethers';

export function parseAddressesInput<T>(input: string, convert: (meta: string[]) => T): { [key: string]: T } {
  if (input.trim() === '') {
    throw { message: 'Invalid input', description: 'Please provide an address list' };
  }

  const rawData: string[] = input.trim().split('\n');

  const data = {};
  for (const rawRecord of rawData) {
    const [uncheckedAddress, ...rest] = rawRecord.split(/[,;\t]/).map((x) => x.trim());
    let address;

    try {
      address = ethers.utils.getAddress(uncheckedAddress);
    } catch (e) {
      throw { message: 'Error parsing address list', description: `${e.reason}: ${uncheckedAddress}` };
    }
    data[address] = convert(rest);
  }

  return data;
}
