import { useAppState } from './StateContext';
import { AccountsMeta } from '@lib';
import _ from 'lodash';

export function useAccountNotes(tokenAddress: string): AccountsMeta {
  const [{ accountNotes, accountNames }] = useAppState();
  const tokenAccountNotes = (accountNotes && accountNotes[tokenAddress]) || {};

  return _.merge(
    _.mapValues(accountNames, (x) => ({ name: x })),
    _.mapValues(tokenAccountNotes, (x) => ({ note: x })),
  );
}
