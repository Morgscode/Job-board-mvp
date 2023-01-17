# OJB - Open Job Board Monorepo

This monorepo is setup for NPM workspaces (https://docs.npmjs.com/cli/v7/using-npm/workspaces)

## TODOS 

1. better host selection in http services for docker container setup
2. build advanced search form and api query jobs route
3. setup complex email handler with pug templates
4. setup email templates for 
  - ojb register email
  - job application email
  - job application status update email
5. upload route for assets

## Requirements

- Node.js 16.16.0
- NPM 7.24.2
- MySQL 5.7

### SETUP

1. From the root of the monorepo - run `npm i`
2. Follow the environment setup instructions for the api
3. From the root of the monorepo - run `npm run dev`

## OJB Tooling

- A docker compose environment for QA and cloud deployment is ready to go. Follow below for setup instructions.

1.  Create an env file for the db in `./ojb-tooling/mysql/.env`

```
MYSQL_HOST=localhost
MYSQL_TCP_PORT=3306
MYSQL_DATABASE=ojb_local
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_ROOT_PASSWORD=root
```

2.  Create an env file for the api in `./ojb-tooling/node/.env` - take a look at `example.env`
3. Create an env file for the cms in `./ojb-tooling/web/.env`

```
VITE_API_URL=http://localhost:8080/api/v1
NODE_PORT=8888
NODE_HOST=0.0.0.0
```

4.  Copy `example.setup.sh` to `setup.sh` into the root of the project.
5.  Enter your db credentials to pass into the setup script.

```
MYSQL_DB=ojb_local MYSQL_USER=root MYSQL_PASS=root MYSQL_HOST=db MYSQL_PORT=3306 node ./dev-data/app-setup.js
```

6.  Build the container

```
cd ./ojb-tooling
docker-compose up --build
```

7.  run the setup script from the api container

```
docker exec -it ojb-api /bin/bash
sh setup.sh
```

8. Register as a user through the api

```
POST: http://localhost:8080/api/v1/register
{
  "email": "your@email.here",
  "password": "password",
  "passwordConfirm": "password"
}
```

9. In the phpMyAdmin container - update your user role to `3` and your email verified at to a `current timestamp`
10. Explore the cms
11. Explore the job finder site

## API

#### SETUP

1. From the root of the monorepo - run `npm i`
2. Follow the api environment setup instructions below
3. From the root of the monorepo - run `npm run dev:api`

- API Environment

  1. Set your root environment in `./api/config/config.env` to either `development` or `production` or `whateverenvyoulike`
  2. Then create a file for your environment i.e. `development.env` or `production.env` or `whateverenvyoulike.env` - take a look at the `example.env`

- Custom environments

  Out of the box - OJB comes configured to handle `production` and `development` environment. You can create extra environments by following the naming conventions with your new .env files explained above. Be sure to load your env in the switch statement in `./api/env.js` before setting it as the app environment in `./api/config/config.env`

- Database seeding - An exmaple setup shell script `./api/dev-data/app-setup.js` is provided to create some jobs, categories and locations.

  1. copy `example.setup.sh` to `setup.sh` into the root of the project.
  2. enter your db credentials to pass into the setup script.
  3. run the setup script.

## CMS

### SETUP

1. From the root of the monorepo - run `npm i`
2. From the root of the monorepo - run `npm run dev:cms`

## JOBFINDER SITE

### SETUP

1. From the root of the monorepo - run `npm i`
2. From the root of the monorepo - run `npm run dev:jobfinder-site`