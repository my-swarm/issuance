import { Kya } from './kya';

interface PutKyaResponse {
  cid: string;
}

export class Api {
  private baseUrl;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async putKya(kya: Kya): Promise<string> {
    const response = await this.apiRequest<PutKyaResponse>(`kya/put`, kya);
    return response.cid;
  }

  async getKya(cid: string): Promise<Kya> {
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
