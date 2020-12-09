import { LocalToken, LocalFundraiser } from '..';

export interface ColdState {
  tokens: LocalToken[];
  accountNames: Record<string, string>; // account address -> name
  accountNotes: Record<string, Record<string, string>>; // token address -> account address -> note
  fundraisers: Record<string, LocalFundraiser>;
  version: number;
}
