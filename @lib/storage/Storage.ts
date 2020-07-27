import { IStorageAdapter } from './IStorageAdapter';
import { ColdState } from '@types';

export class Storage {
  private adapter: IStorageAdapter;

  constructor(adapter: IStorageAdapter) {
    this.adapter = adapter;
  }

  public save(data: ColdState) {
    return this.adapter.save(data);
  }

  public load(): ColdState {
    return this.adapter.load();
  }
}
