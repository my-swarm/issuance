import { ColdState } from './common';
export interface IStorageAdapter {
  save: (data: ColdState) => void;
  load: () => ColdState;
}
