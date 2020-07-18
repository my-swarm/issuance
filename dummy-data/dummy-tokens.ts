import { Token, TransferRestrictionTypes } from '../types';
import { v4 as uuid } from 'uuid';

export const dummyTokens: Token[] = [
  {
    id: uuid(),
    name: 'Testing token',
    symbol: 'TST',
    decimals: 18,
    initialSupply: 1000,
    description: 'Testing dummy token',
    transferRestrictionType: TransferRestrictionTypes.None,
  },
  {
    id: uuid(),
    name: 'Swarm Token',
    symbol: 'SWM',
    decimals: 18,
    initialSupply: 10000000,
    description: 'Swarm network utility token',
    transferRestrictionType: TransferRestrictionTypes.Whitelist,
  },
];
