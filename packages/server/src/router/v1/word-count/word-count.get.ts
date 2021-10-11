import { Api } from '@web-scraper/shared/src';
import axios from 'axios';
import cheerio from 'cheerio';
import { Context } from 'koa';
import { Spec } from 'koa-joi-router';
import Cache from '../../../cache/cache';
import { TimeInMs } from '../../../utils/enums.util';
import { validatorRules } from './word-count.get.validation';

export type Handler = (id: string, ctx: Context) => Promise<Api.PostWordCount.ResponseBody>;

export type WordCountDeps = {
  cacheClient: Cache;
};

export function cleanseTextToArr(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, " ").split(' ');
}

export function countSortWords(textArr: string[]) {
  return [...textArr.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map()).entries()].sort();
}

export function tupleToHTML<T, U>(tuple: [T, U][]): string {
  return JSON.stringify(tuple)
    .replace(/\["/g, '<div>')
    .replace(/]/g, '</div>')
    .replace(/",/g, ': ')
    .replace(/\[/g, '')
    .replace(/\]/g, '')
    .replace(/""/g, '')
    .replace(/,/g, '');
};

function getHandler(deps: WordCountDeps) {
  return async (url: string, _ctx: Context): Promise<Api.PostWordCount.ResponseBody> => {
    const apiResults = await deps.cacheClient.getKey(url);

    if (!apiResults) {
      const { data } = await axios.get(url);

      const $page = cheerio.load(data);
  
      const text = $page('body').text();
  
      // Throw away extra white space and non-alphanumeric characters
      const cleansedArr = cleanseTextToArr(text);

      // Convert text initially to a dictionary that contains each word's frequency count and sort by ascending order
      const tupleArr: [string, string][] = countSortWords(cleansedArr);

      // Then convert to a stringified array tuple that can be formatted to stringified HTML
      const htmlStr = tupleToHTML<string, string>(tupleArr);
    
      // Cache the response for 10 minutes as we can be almost certain that
      // nothing will change in the meantime for something such as a webpage
      await deps.cacheClient.setKey(url, htmlStr, 'EX', TimeInMs.TenMinutes);
  
      return {
        data: htmlStr,
        createdAt: new Date(),
      }
    }

    // Immediately return the stored api response if we already have it cached in Redis
    return {
      data: apiResults,
      createdAt: new Date(),
    }
  };
}

function getWordCount(handler: Handler): Spec {
  return {
    method: 'GET',
    path: '/word-count',
    validate: validatorRules,
    handler: async (ctx) => {
      const { url } = <Api.PostWordCount.RequestQuery>ctx.query;

      ctx.body = await handler(url, ctx);
    }
  };
}

export default function getWordCountEndpoint(deps: WordCountDeps): Spec {
  return getWordCount(getHandler(deps));
}