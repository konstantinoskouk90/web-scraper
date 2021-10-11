import { Middleware } from 'koa';
import ratelimit from 'koa-ratelimit';
import Cache from '../cache/cache';

export function rateLimitMiddleware(
  cacheClient: Cache,
  duration: number,
  maxRequests: number,
  identifier?: string,
): Middleware {
  return ratelimit({
    db: cacheClient.client,
    disableHeader: false,
    driver: 'redis',
    duration,
    errorMessage: 'Rate limit exceeded',
    headers: {
      remaining: 'Rate-Limit-Remaining',
      reset: 'Rate-Limit-Reset',
      total: 'Rate-Limit-Total'
    },
    id: (ctx) => identifier ? `${ ctx.ip }-${ identifier }` : ctx.ip,
    max: maxRequests,
  });
}