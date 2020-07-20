import { AppContext } from '@types';
export interface IStorageAdapter {
  save: (data: AppContext) => void;
  load: () => AppContext;
}
