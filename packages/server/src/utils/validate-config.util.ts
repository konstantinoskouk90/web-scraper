import { Joi } from 'koa-joi-router';
import config, { IConfig } from 'config';

export type RateLimitArgs = {
  maxRequests: number;
  duration: number;
};

export interface AppConfig extends IConfig {
  api: {
    port: number;
    rateLimit: {
      public: RateLimitArgs;
    },
  };
  redis: {
    host: string;
    port: number;
  };
}

export const appConfigValidation = Joi.object({
  api: Joi.object({
    port: Joi.number(),
    rateLimit: Joi.object({
      public: Joi.object({
        maxRequests: Joi.number(),
        duration: Joi.number(),
      }),
    }),
  }),
  redis: Joi.object({
    host: Joi.string(),
    port: Joi.number(),
  }),
});

export const appConfig = config as AppConfig;
