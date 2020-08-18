import { useEthers } from './EthersContext';
import { Token, TokenNetworkData } from '../@types';

interface UseTokenNetworkReturn extends TokenNetworkData {
  src20Address: string;
}

export function useTokenNetwork(token: Token): UseTokenNetworkReturn {
  const { networkId } = useEthers();
  const tokenNetwork = token.networks[networkId];
  const { addresses } = tokenNetwork;
  return {
    ...tokenNetwork,
    src20Address: addresses.src20,
  };
}
