FROM node:16.4.2

# Environment
WORKDIR $DIR/web-scraper-server/

# Dependencies
COPY package.json tsconfig.json yarn.lock $DIR/web-scraper-server/
COPY packages/shared/ $DIR/web-scraper-server/packages/shared/
COPY packages/server/ $DIR/web-scraper-server/packages/server/

# Build
RUN yarn install --pure-lockfile
RUN yarn build:shared
RUN yarn build:server

# Serve
EXPOSE 3001
CMD ["yarn", "start:server"]