import { useState } from 'react';

import { Storage, LocalStorageAdapter, ColdState } from '@lib';

export function useStorage() {
  const [isWorking, setIsWorking] = useState(false);
  const adapter = new LocalStorageAdapter();
  const storage = new Storage(adapter);

  async function load(): Promise<ColdState> {
    setIsWorking(true);
    const result = await storage.load();
    setIsWorking(false);
    return result;
  }

  async function save(state: ColdState): Promise<void> {
    setIsWorking(true);
    await storage.save(state);
    setIsWorking(false);
  }

  return {
    isWorking,
    load,
    save,
  };
}
