import { Joi, Spec } from 'koa-joi-router';

export const validatorRules: Spec['validate'] = {
  failure: 400,
  continueOnError: false,
  header: Joi.object().unknown(true),
  query: Joi.object().keys({ url: Joi.string().required() }).required(),
  params: Joi.object().length(0).unknown(false).options({ abortEarly: false }),
  output: {
    200: {
      body: Joi.object().keys({
        data: Joi.string().required(),
        createdAt: Joi.date().required(),
      }).required(),
    },
  },
};