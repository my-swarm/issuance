import { ColdState } from '@types';
export interface IStorageAdapter {
  save: (data: ColdState) => void;
  load: () => ColdState;
}
