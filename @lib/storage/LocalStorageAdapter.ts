import { IStorageAdapter } from './IStorageAdapter';
import { AppState } from '@types';

export class LocalStorageAdapter implements IStorageAdapter {
  static readonly LS_KEY = 'data';

  public save(data: AppState) {
    window.localStorage.setItem(LocalStorageAdapter.LS_KEY, LocalStorageAdapter.serialize(data));
  }

  public load() {
    return LocalStorageAdapter.unserialize(window.localStorage.getItem(LocalStorageAdapter.LS_KEY));
  }

  private static serialize(data: AppState): string {
    return JSON.stringify(data);
  }

  private static unserialize(serializedData: string | null): AppState {
    if (!serializedData) {
      return null;
    }
    return JSON.parse(serializedData);
  }
}
