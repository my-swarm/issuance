import { IStorageAdapter } from './IStorageAdapter';
import { ColdState } from './common';

export class LocalStorageAdapter implements IStorageAdapter {
  static readonly LS_KEY = 'data';

  public save(data: ColdState) {
    window.localStorage.setItem(LocalStorageAdapter.LS_KEY, LocalStorageAdapter.serialize(data));
  }

  public load() {
    return LocalStorageAdapter.unserialize(window.localStorage.getItem(LocalStorageAdapter.LS_KEY));
  }

  private static serialize(data: ColdState): string {
    return JSON.stringify(data);
  }

  private static unserialize(serializedData: string | null): ColdState {
    if (!serializedData) {
      return null;
    }
    return JSON.parse(serializedData);
  }
}
