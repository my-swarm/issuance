import { IStorageAdapter } from './IStorageAdapter';
import { AppContext } from '@types';

class LocalStorageAdapter implements IStorageAdapter {
  static readonly LS_KEY = 'data';

  public store(data: AppContext) {
    window.localStorage.setItem(LocalStorageAdapter.LS_KEY, LocalStorageAdapter.serialize(data));
  }

  public load() {
    return LocalStorageAdapter.unserialize(window.localStorage.getItem(LocalStorageAdapter.LS_KEY));
  }

  private static serialize(data: AppContext): string {
    return JSON.stringify(data);
  }

  private static unserialize(serializedData: string | null): AppContext {
    if (!serializedData) {
      return null;
    }
    return JSON.parse(serializedData);
  }
}
