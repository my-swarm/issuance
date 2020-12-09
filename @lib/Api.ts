import { Kya } from './kya';

export interface PutKyaResponse {
  cid: string;
  hash: string;
}

export class Api {
  private readonly baseUrl;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async putKya(kya: Kya): Promise<PutKyaResponse> {
    const response = await this.apiRequest<PutKyaResponse>(`kya/put`, kya);
    return response;
  }

  async getKya(cid: string): Promise<Kya> {
    let found;
    if ((found = cid.match(/ipfs:(.+)/))) {
      cid = found[1];
    }
    return this.apiRequest<Kya>(`kya/get`, { cid });
  }

  private async apiRequest<T>(path: string, body: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${path}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return ((await response.json()) as unknown) as T;
  }
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
export const api = new Api(apiUrl);
