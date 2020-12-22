import { AppFile, LocalToken, api, LocalTokenKya } from '.';

export type KyaFile = AppFile;

export type Kya = {
  token: {
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

export function tokenToKya(token: LocalTokenKya): Kya {
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
      legalDocuments: token.assetLegalDocuments || [],
    },
  };
}

export function kyaToToken(kya: Kya, nav: number): LocalTokenKya {
  return {
    image: kya.token.image,
    description: kya.token.description,
    assetName: kya.asset.name,
    assetDescription: kya.asset.description,
    assetNetValue: nav,
    assetNavDocument: kya.asset.navDocument,
    assetImage: kya.asset.image,
    assetLegalDocuments: kya.asset.legalDocuments || [],
  };
}

export async function storeKya(kya: Kya): Promise<{ kyaHash: string; kyaUrl: string }> {
  const { cid, hash } = await api.putKya(kya);
  return { kyaUrl: `ipfs:${cid}`, kyaHash: `0x${hash}` };
}
