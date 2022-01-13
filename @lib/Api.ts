import { Kya } from './kya';

export interface PutKyaResponse {
  cid: string;
  hash: string;
}

interface RequestOptions {
  timeout: number;
}

export class Api {
  private readonly baseUrl;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async putKya(kya: Kya): Promise<PutKyaResponse> {
    return await this.apiRequest<PutKyaResponse>(`kya/put`, kya, { timeout: 5000 });
  }

  async getKya(cid: string): Promise<Kya> {
    let found;
    if ((found = cid.match(/ipfs:(.+)/))) {
      cid = found[1];
    }
    return this.apiRequest<Kya>(`kya/get`, { cid });
  }

  private async apiRequest<T>(path: string, body: any, options: Partial<RequestOptions> = {}): Promise<T> {
    const timeout = options.timeout ?? 10000;
    const controller = new AbortController();
    const to = setTimeout(controller.abort, timeout);
    const response = await fetch(`${this.baseUrl}/${path}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(to);
    const responseData = ((await response.json()) as unknown) as T & { error: string };
    if (response.status >= 400) {
      console.log('status >= 400', responseData.error);
      throw new Error(responseData.error || 'Unknown backend error');
    }
    return responseData;
  }
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
export const api = new Api(apiUrl);
