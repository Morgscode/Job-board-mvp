# OJB - Open Job Board Monorepo

This monorepo is powered for devleopment and production using NPM workspaces (https://docs.npmjs.com/cli/v7/using-npm/workspaces)

## TODOS

1. setup datatable filtering for jobs

## Requirements

- Node.js 16.16.0
- NPM 7.24.2
- MySQL 5.7

### SETUP

1. From the root of the monorepo - run `npm i`
2. Follow the environment setup instructions for the api
3. From the root of the monorepo - run `npm run dev`

## OJB Tooling

- A docker compose environment for QA is ready to go. Follow below for setup instructions.

1.  Create an env file for the db in `./ojb-tooling/mysql/.env`

```
MYSQL_HOST=localhost
MYSQL_TCP_PORT=3306
MYSQL_DATABASE=ojb_local
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_ROOT_PASSWORD=root
```

2.  Create an env file for the api in `./ojb-tooling/node/.env`

```
APP_ENV_LOADED=1
API_DOMAIN=http://localhost:8080/api/v1
NODE_PORT=8080
MYSQL_HOST=db
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASS=root
MYSQL_DB=ojb_local
JWT_SECRET=yOuRsUpErSeCuReSeCrEt
SMTP_NAME=smtp@sender.name
SMTP_HOST=smtp.relay
SMTP_PORT=587
SMTP_USER=yoursmtp@user.com
SMTP_MASTER_PASS=pass
SMTP_KEY=key
MAIL_FROM=mail from <email@here>
UPLOADS_DIR=storage/uploads
```

3. Create an env file for the admin client in `./ojb-tooling/web/.env`

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
}
```

9. In the phpMyAdmin container - update your user role to `3` and your email verified at to a `current timestamp`
10. Explore the admin client - coming soon: explore the job finder site

## API

- At its core - the ojb api is an express application. This means you can build on top of it like you would any other express application (https://expressjs.com/).

#### SETUP

1. From the root of the monorepo - run `npm i`
2. Follow the api environment setup instructions below
3. From the root of the monorepo - run `npm run dev:api`

- API Environment

  1. Set your root environment in `./api/config/config.env` to either `development` or `production` or `whateverenvyoulike`
  2. Then create a file for you environment and fill in the following variables i.e. `development.env` or `production.env` or `whateverenvyoulike.env`

     ```
     API_DOMAIN=http://localhost:8080/api/v1
     NODE_PORT=8080
     MYSQL_HOST=127.0.0.1
     MYSQL_PORT=8889
     MYSQL_USER=root
     MYSQL_PASS=root
     MYSQL_DB=ojb_db_name
     JWT_SECRET=yOuRsUpErSeCuReSeCrEt
     SMTP_NAME=smtp@sender.name
     SMTP_HOST=smtp.relay
     SMTP_PORT=587
     SMTP_USER=yoursmtp@user.com
     SMTP_MASTER_PASS=pass
     SMTP_KEY=key
     MAIL_FROM=mail from <email@here>
     UPLOADS_DIR=storage/uploads
     ```

- Custom environments

  Out of the box - OJB comes configured to handle `production` and `development` environment. You can create extra environments by following the naming conventions with your new .env files explained above. Be sure to load your env in the switch statement in `./api/env.js` before setting it as the app environment in `./api/config/config.env`

- Database seeding - An exmaple setup shell script `./api/dev-data/app-setup.js` is provided to create some jobs, categories and locations.

  1. copy `example.setup.sh` to `setup.sh` into the root of the project.
  2. enter your db credentials to pass into the setup script.
  3. run the setup script.

## ADMIN CLIENT

- At its core - the ojb admin client is a React application. This means you can build on top of it like you would any other React application (https://reactjs.org/).

### SETUP

1. From the root of the monorepo - run `npm i`
2. From the root of the monorepo - run `npm run dev:admin-client`

## JOBFINDER SITE
