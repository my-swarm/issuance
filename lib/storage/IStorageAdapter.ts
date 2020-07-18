import { AppContext } from '@types';
export interface IStorageAdapter {
  store: (data: AppContext) => void;
  load: () => AppContext;
}
