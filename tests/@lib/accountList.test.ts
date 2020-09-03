import { getStakeFromNav } from '@lib/stake';
import { AccountList } from '../../@types';
import { mergeAccountLists, subtractAccountLists } from '../../@lib';

const accountList1: AccountList = [
  { address: 'address1', name: 'Name1', note: 'Note1' },
  { address: 'address2', name: 'Name2', note: 'Note2' },
  { address: 'address3', name: 'Name3', note: 'Note3' },
  { address: 'address4', name: 'Name4', note: 'Note4' },
];

test('can merge account lists', () => {
  const accountList2: AccountList = [
    { address: 'address2', name: 'Name2Changed', note: 'Note2Changed' },
    { address: 'address5', name: 'Name5', note: 'Note5' },
  ];

  const expected = [
    { address: 'address1', name: 'Name1', note: 'Note1' },
    { address: 'address2', name: 'Name2Changed', note: 'Note2Changed' },
    { address: 'address3', name: 'Name3', note: 'Note3' },
    { address: 'address4', name: 'Name4', note: 'Note4' },
    { address: 'address5', name: 'Name5', note: 'Note5' },
  ];

  const merged = mergeAccountLists(accountList1, accountList2);
  expect(merged).toEqual(expected);
});

test('can subtract account lists with another account list', () => {
  const subtract1 = [
    { address: 'address2', name: 'Name2Changed', note: 'Note2Changed' },
    { address: 'address5', name: 'Name5', note: 'Note5' },
  ];

  const expected = [
    { address: 'address1', name: 'Name1', note: 'Note1' },
    { address: 'address3', name: 'Name3', note: 'Note3' },
    { address: 'address4', name: 'Name4', note: 'Note4' },
  ];

  const result = subtractAccountLists(accountList1, subtract1);
  expect(result).toEqual(expected);
});

test('can subtract account lists with a string array', () => {
  const subtract1 = ['address2', 'address5'];

  const expected = [
    { address: 'address1', name: 'Name1', note: 'Note1' },
    { address: 'address3', name: 'Name3', note: 'Note3' },
    { address: 'address4', name: 'Name4', note: 'Note4' },
  ];

  const result = subtractAccountLists(accountList1, subtract1);
  expect(result).toEqual(expected);
});
