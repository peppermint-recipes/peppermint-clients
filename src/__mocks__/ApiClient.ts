import { AxiosInstance } from 'axios';

type url = string;
type data = any;

export default class ApiClient implements Pick<AxiosInstance, 'post' | 'delete' | 'get' | 'put' > {
  private store: Map<url, data>

  constructor() {
    this.store = new Map();
  }

  get(url: string): Promise<any> {
    return this.store.get(url);
  }

  async delete(url: string) {
    this.store.delete(url);
    return
  }

  post(url: string, data: any): Promise<any> {
    this.store.set(url, data);
    return data;
  }

  put(url: string, data: any): Promise<any> {
    const oldData = this.store.get(url);

    this.store.set(url, { ...oldData, data });

    return { ...oldData, data };
  }
}
