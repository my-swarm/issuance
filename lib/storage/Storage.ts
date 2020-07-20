import { IStorageAdapter } from './IStorageAdapter';
import { AppContext } from '@types';

export class Storage {
  private adapter: IStorageAdapter;

  constructor(adapter: IStorageAdapter) {
    this.adapter = adapter;
  }

  public save(data: AppContext) {
    console.log('storge save', data);
    return this.adapter.save(data);
  }

  public load(): AppContext {
    return this.adapter.load();
  }
}
