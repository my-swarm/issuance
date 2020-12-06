import { AppFile, Token } from '.';

export type KyaFile = AppFile;

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
