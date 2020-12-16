import { Kya, tokenToKya, api, OnlineToken } from '@lib';
import { useEffect, useState } from 'react';
import { useAppState } from './StateContext';

export function useKya(token?: OnlineToken): { kya: Kya; nav: number } {
  const [kya, setKya] = useState<Kya>();
  const [nav, setNav] = useState<number>();

  const [{ onlineToken, localToken }] = useAppState();

  useEffect(() => {
    const t = token || onlineToken;
    if (t) {
      api.getKya(t.kyaUrl).then((kya) => setKya(kya));
      setNav(t.nav);
    } else if (localToken) {
      setKya(tokenToKya(localToken));
      setNav(localToken.assetNetValue);
    }
  }, [onlineToken, localToken]);

  return { kya, nav };
}
