import Cache from './cache/cache';
import ApiServer from './app';
import { appConfig, appConfigValidation } from './utils/validate-config.util';

const init = async () => {
  // Configuration
  const { error } = appConfigValidation.validate(appConfig);
  if (error) {
    throw error;
  }

  const {
    api: { port: apiPort, rateLimit },
    redis: { host, port: redisPort },
  } = appConfig;
  console.log('ready - validated Configuration');

  const cache = new Cache({ host, port: redisPort });

  console.log('ready - started Redis cache on http://localhost:6379');

  const server = new ApiServer(
    cache,
    { rateLimit },
  );

  server.listen(apiPort, () => console.log(`ready - started Koa server on http://localhost:${ apiPort }`));
};

init().catch((error) => {
  console.log('error - proxy server ', error);
  process.exit(1);
});