import { Api } from '@web-scraper/shared/src';
import { API, Http, httpService } from './http.service';

class NoAuthApiService {

  constructor(private readonly httpService: Http, private readonly apiUrl: string, private readonly apiPrefix: string) {}

  async getWordCount(qs: Api.PostWordCount.RequestQuery): Promise<Api.PostWordCount.ResponseBody> {    
    const { body: response } = await this.httpService.request<Api.PostWordCount.RequestQuery, Api.PostWordCount.ResponseBody>({
      url: `${ this.apiUrl }/${ this.apiPrefix }/word-count`,
      method: 'GET',
      qs: { url: qs.url },
    });

    return response;
  }
}

export type NoAuthApi = NoAuthApiService;
export const noAuthApi = new NoAuthApiService(httpService, API.base, API.version);