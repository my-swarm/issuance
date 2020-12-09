import { Kya, tokenToKya, api } from '@lib';
import { useEffect, useState } from 'react';
import { useAppState } from './StateContext';

export function useKya(): { kya: Kya; nav: number } {
  const [kya, setKya] = useState<Kya>();
  const [nav, setNav] = useState<number>();

  const [{ onlineToken, localToken }] = useAppState();

  useEffect(() => {
    if (onlineToken) {
      api.getKya(onlineToken.kyaUrl).then((kya) => setKya(kya));
      setNav(onlineToken.nav);
    } else if (localToken) {
      setKya(tokenToKya(localToken));
      setNav(localToken.assetNetValue);
    }
  }, [onlineToken, localToken]);

  return { kya, nav };
}
