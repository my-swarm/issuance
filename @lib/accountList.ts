import { AccountList } from '../@types';

export function mergeAccountLists(a: AccountList, b: AccountList): AccountList {
  const result = [...a];
  for (const bItem of b) {
    const existingIndex = result.findIndex((resultItem) => resultItem.address === bItem.address);
    if (existingIndex !== -1) {
      result[existingIndex] = bItem;
    } else {
      result.push(bItem);
    }
  }

  return result;
}

export function subtractAccountLists(a: AccountList, b: AccountList | string[]): AccountList {
  let result = [...a];
  for (const bItem of b) {
    const address = typeof bItem === 'string' ? bItem : bItem.address;
    const existingIndex = result.findIndex((resultItem) => resultItem.address === address);
    if (existingIndex !== -1) {
      result = [...result.slice(0, existingIndex), ...result.slice(existingIndex + 1)];
    }
  }

  return result;
}
