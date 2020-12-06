import { AppFile, Token } from '.';
import { Api } from './Api';
import { apiUrl } from '@app';

export type KyaFile = AppFile;

const api = new Api(apiUrl);

export type Kya = {
  token: {
    // name: string;
    // symbol: string;
    image: KyaFile;
    description: string;
  };
  asset: {
    name: string;
    description: string;
    image: KyaFile;
    navDocument: KyaFile;
    legalDocuments: KyaFile[];
  };
};

export function tokenToKya(token: Token): Kya {
  return {
    token: {
      description: token.description,
      image: token.image,
    },
    asset: {
      name: token.assetName,
      description: token.assetDescription,
      image: token.assetImage,
      navDocument: token.assetNavDocument,
      legalDocuments: token.assetLegalDocuments,
    },
  };
}

export async function storeKya(kya: Kya): Promise<{ kyaHash: string; kyaUrl: string }> {
  const { cid, hash } = await api.putKya(kya);
  return { kyaUrl: `ipfs:${cid}`, kyaHash: `0x${hash}` };
}
