FROM node:16.4.2

# Environment
WORKDIR $DIR/web-scraper-client/

# Dependencies
COPY package.json tsconfig.json yarn.lock $DIR/web-scraper-client/
COPY packages/client/ $DIR/web-scraper-client/packages/client/
COPY packages/shared/ $DIR/web-scraper-client/packages/shared/

# Build
RUN yarn install --pure-lockfile
RUN yarn build:shared
RUN yarn build:client

# Serve
EXPOSE 3000
CMD ["yarn", "start:client"]