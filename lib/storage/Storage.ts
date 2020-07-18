import { IStorageAdapter } from './IStorageAdapter';
import { AppContext } from '@types';

class Storage {
  private adapter: IStorageAdapter;

  constructor(adapter: IStorageAdapter) {
    this.adapter = adapter;
  }

  public store(data: AppContext) {
    return this.adapter.store(data);
  }

  public load(): AppContext {
    return this.adapter.load();
  }
}
