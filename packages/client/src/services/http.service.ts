import axios, { AxiosResponse } from 'axios';

export const API = {
  base: 'http://localhost:3001/api',
  version: 'v1'
};

export type HTTPHeaders = Record<string, string>;
export type HTTPRequestOptions<U> = {
  url: string;
  body?: U;
  headers?: HTTPHeaders;
  method?: 'PATCH' | 'POST' | 'GET' | 'DELETE';
  qs?: Record<string, string | number>;
};

class HttpService {
  constructor() {}

  async request<U, T>(options: HTTPRequestOptions<U>): Promise<{ body: T; responseHeaders: HTTPHeaders }> {
    const { body, headers, method, url } = options;

    const response = await axios.request<U, AxiosResponse<T>>({
      method,
      url,
      data: body,
      headers: body
        ? { 'Content-Type': 'application/json; charset=UTF-8', ...options.headers }
        : headers,
      params: options?.qs,
    });

    return { body: response.data, responseHeaders: response.headers };
  }
}

export const httpService = new HttpService();
export type Http = HttpService;