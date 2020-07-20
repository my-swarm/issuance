import { useState } from 'react';

import { Storage, LocalStorageAdapter } from '@lib';
import { AppState } from '../types';

export function useStorage() {
  const [isWorking, setIsWorking] = useState(false);
  const adapter = new LocalStorageAdapter();
  const storage = new Storage(adapter);

  async function load(): Promise<AppState> {
    setIsWorking(true);
    const result = await storage.load();
    setIsWorking(false);
    return result;
  }

  async function save(appState?: AppState): Promise<void> {
    setIsWorking(true);
    await storage.save(appState);
    setIsWorking(false);
  }

  return {
    isWorking,
    load,
    save,
  };
}
