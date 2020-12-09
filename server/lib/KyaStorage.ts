import createIpfsClient from 'ipfs-http-client';
import _ from 'lodash';
import dataUriToBuffer from 'data-uri-to-buffer';
import uint8Array from 'uint8arrays';
import all from 'it-all';
import keccak256 from 'keccak256';

interface IpfsConfig {
  protocol: string;
  host: string;
  port: number;
}

export type KyaFile = {
  id: string;
  name: string;
  size: number;
  thumbUrl?: string;
  type: string;
  content: string;
};

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

type FileContent = Uint8Array | Blob | string;

export class KyaStorage {
  private static filePaths = ['token.image', 'asset.image', 'asset.navDocument', 'asset.legalDocuments'];
  private ipfs: any;

  constructor(config: IpfsConfig) {
    this.ipfs = createIpfsClient(config);
  }

  public cat(cid: string): string {
    return this.ipfs.cat(cid);
  }

  public async put(kya: Kya): Promise<{ cid: string; hash: string }> {
    kya = await this.walkKya(kya, async (file) => await this.contentToCid(file));
    const kyaJson = JSON.stringify(kya);
    const hash = keccak256(kyaJson).toString('hex');
    const cid = await this.ipfsAdd(kyaJson);
    return { cid, hash };
  }

  public async get(cid: string): Promise<Kya> {
    const kya = JSON.parse(await this.ipfsCat(cid)) as Kya;
    return await this.walkKya(kya, async (file) => await this.cidToContent(file));
  }

  private async walkKya(kya: Kya, mapCallback: (from: any) => Promise<any>): Promise<Kya> {
    const newKya = _.cloneDeep(kya);

    for (const path of KyaStorage.filePaths) {
      const file = _.get(newKya, path);
      if (file) {
        if (_.isArray(file)) {
          for (const key in file) {
            _.set(newKya, `${path}[${key}]`, await mapCallback(file[key]));
          }
        } else {
          _.set(newKya, path, await mapCallback(file));
        }
      }
    }
    return newKya;
  }

  private async contentToCid(file: KyaFile): Promise<KyaFile> {
    if (!file.content) {
      throw new Error('Not a proper KyaFile');
    }
    if (file.content.match(/^ipfs:/)) {
      return file;
    }
    if (file.content.match(/^data:/)) {
      return { ...file, content: 'ipfs:' + (await this.ipfsAddDataUri(file.content)) };
    }
    throw new Error('Could not convert KyaFile content to CID');
  }

  private async cidToContent(file: KyaFile): Promise<KyaFile> {
    if (!file.content) {
      throw new Error('Not a proper KyaFile');
    }
    if (file.content.match(/^data:/)) {
      return file;
    }
    const found = file.content.match(/^ipfs:(.*)/);
    if (found && found[1]) {
      const data = await this.ipfsCat(found[1], 'base64');
      const content = `data:${file.type};base64,${data}`;
      return { ...file, content };
    }
    throw new Error('Could not convert KyaFile content to CID');
  }

  private async ipfsAddDataUri(dataUri: string): Promise<string> {
    return await this.ipfsAdd(new Uint8Array(dataUriToBuffer(dataUri)));
  }

  private async ipfsAdd(data: FileContent): Promise<string> {
    const result = await this.ipfs.add(data);
    return result.cid.toString();
  }

  private async ipfsCat(cid: string, encoding = 'utf-8'): Promise<string> {
    const data = uint8Array.concat(await all(this.ipfs.cat(cid)));
    return uint8Array.toString(data, encoding);
  }
}
