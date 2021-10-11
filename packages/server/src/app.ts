import Application from 'koa';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import createRouter from 'koa-joi-router';
import { rateLimitMiddleware } from './middlewares/rate-limit.middleware';
import Cache from './cache/cache';
import getWordCountEndpoint from './router/v1/word-count/word-count.get';
import { RateLimitArgs } from './utils/validate-config.util';

type ApiServerConfig = { rateLimit: { public: RateLimitArgs } };

export default class ApiServer extends Application {

  constructor(
    private readonly cacheClient: Cache,
    private readonly config: ApiServerConfig,
  ) {
    super();

    this.use(helmet());
    this.use(cors());
    this.use(bodyParser());

    const publicEndpoints = createRouter();

    publicEndpoints.prefix('/api/v1');

    const publicRoutes = [
      getWordCountEndpoint({ cacheClient: this.cacheClient }),
    ];

    // Rate Limiting
    publicEndpoints.use(rateLimitMiddleware(
      this.cacheClient,
      this.config.rateLimit.public.duration,
      this.config.rateLimit.public.maxRequests,
      'public',
    ));

    publicEndpoints.route(publicRoutes);

    this.use(publicEndpoints.middleware());
  }
}