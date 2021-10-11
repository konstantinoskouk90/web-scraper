# Web Scraper

**Features**:

* Allows users to input a URL and retrieve the word frequency of that page.
* Allows users to view their search history.

**How To Run**:

1. (Mandatory) Make sure you have [yarn](https://www.npmjs.com/package/yarn) installed globally. This project uses the newest version of yarn `3.0.0-rc.6`.

2. (Mandatory) This project has been setup as a monorepo. You will need to run `yarn install` from the root when you first clone to install all dependencies.

3. (Mandatory) When done with installing, again at the root `/` level of the application, run `yarn start`. This will run both the `client` and the `server` in parallel. **IMPORTANT NOTE**: The server uses redis as its cache client and therefore assumes redis is running on port 6379. If you are not running a redis server on that port, please do so by typing a relevant command.

3. (Optional) To run the tests for the client and server run `yarn test`, otherwise to run individually run `yarn client test` or `yarn server test`, all from the root directory.

4. (Optional) To build all workspaces run `yarn build`, otherwise to run individually run `yarn client build`, `yarn server build` or `yarn shared build`, all from the root directory.

5. (Optional) To dockerize the entire project please run `yarn build:docker`. To start the docker containers run: `yarn start:docker`. There are additional commands included to run the client, server separately in the package.json of the root folder.

**Additional Tips**:

1. To install / remove packages to / from a workspace: `yarn { workspace_name } add { package_name }` and `yarn { workspace_name } remove { package_name }`, all from the root level of the application `/`.

2. Many more handy commands added to clean the project, that being npm related or build directory related etc.

**Tech Stack**:

* Project: JS Monorepo which enables us to deploy each workspace separately, while sharing resources between workspaces e.g. shared directory which comes with types that we use in both our FE and BE.
* Front End: React.js via Webpack, so that we avoid the boilerplate that comes with create-react-app, as this project is small in size. Also provides us with more flexibility. Also style-component to style our components, to encourage reusability of styles and avoid using class names which are global and come with significant risks.
* Back End: Koa.js, lightweight Express.js alternative, which allows us to cherrypick what we want to install and is more of a library than a framework. Made sense to use for a project as such where our requirements wer minimal.

**Things Left To Do**:

* Tighten up the text formatting after scraping to make more bulletproof, test against many more URLs.
* Write more tests and increase test coverage.
* Add linting on a per workspace basis.
* Move browser history to a database as local storage is limiting (5MB), and it stores the data on a per browser basis only; it is also harder to extract complex data from.
* Add a .env file to the front end to store environment configuration settings and secrets.
* Scroll search history to the top as soon as a user adds a new URL and presses Enter.

**Questions To Think About**:

Distributed System Design - How would this scale, when the data which is fetched and manipulated, grows significantly?

What we can potentially do to address this in the future is distributed queues - scaling horizontally. Relevant article: [article](https://blog.logrocket.com/scale-node-js-app-using-distributed-queues/). This will not allow us to send an instant response the same way a load balancer would (scaling vertically), but it would help with not making users wait on each others requests, which for an application like this makes more sense to do.