# OJB - Open Job Board Monorepo

This monorepo is setup for NPM workspaces (https://docs.npmjs.com/cli/v7/using-npm/workspaces)

## DOCKER SETUP (OJB-TOOLING)

- A docker compose environment is ready to go out of the box

1.  Create an env file for the db in `./ojb-tooling/mysql/.env`

```
MYSQL_HOST=db
MYSQL_TCP_PORT=3306
MYSQL_DATABASE=ojb_production
MYSQL_ROOT_PASSWORD=root
```

2.  Create an env file for the api in `./ojb-tooling/node/.env` - take a look at `example.env` in `/api`

```
APP_ENV_LOADED=1
NODE_ENV=production
JOBFINDER_SITE_URL=http://localhost:8887
NODE_PORT=8080
MYSQL_HOST=db
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASS=root
MYSQL_DB=ojb_production
JWT_SECRET=yOuRsUpErSeCuReSeCrEt
SMTP_NAME=smtp@sender.name
SMTP_HOST=smtp.relay
SMTP_PORT=587
SMTP_USER=yoursmtp@user.com
SMTP_KEY=key
MAIL_FROM=mail from <email@here>
UPLOADS_DIR=storage/uploads
ASSETS_DIR=public/assets
```

3. Create an env file for the cms and jobfinder site in `./ojb-tooling/web/.env` - take a look at example.env in `/cms` and `jobfinder site`.

```
VITE_API_URL=http://localhost:8080/api/v1
NODE_HOST=cms
NODE_PORT=8888
NEXT_PUBLIC_API_URL=http://api:8080/api/v1
SECRET_COOKIE_PASSWORD=yOuRSuPeRsEcUrEsEcReT
```

4.  Copy `api/example.setup.sh` to `api/setup.sh` into the root of the project.
5.  Enter your db credentials to pass into the setup script.

```
MYSQL_DB=ojb_production MYSQL_USER=root MYSQL_PASS=root MYSQL_HOST=db MYSQL_PORT=3306 node ./dev-data/app-setup.js
```

6.  Build the containers

```
cd ./ojb-tooling
docker-compose up --build
```

7.  run the setup script from the api container

```
docker exec -it ojb-api /bin/bash
sh setup.sh
```

8. Register as a user through the api or the register page on the jobfinder-site

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

### LOCAL SETUP 

## Minimum Requirements 

- Node.js 16.16.0
- NPM 7.24.2
- MySQL 5.7

1. From the root of the monorepo - run `npm i`
2. Follow the environment setup instructions for the api
3. Follow the environment setup instructions for the cms
4. Follow the environment setup instructions for the jobfinder site
5. From the root of the monorepo - run `npm run start`

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

- Database seeding - An exmaple setup shell script `./api/dev-data/app-setup.js` is provided to create enough data to see the project in action.

  1. copy `example.setup.sh` to `setup.sh` in `/api`.
  2. enter your db credentials to pass into the setup script.
  3. run the setup script.
  4. Register as a user through the api.

  ```
  POST: http://localhost:8080/api/v1/register
  {
    "email": "your@email.here",
    "password": "password",
    "passwordConfirm": "password"
  }
  ```
    
  5. In your db client - update your user role to `3` and your email verified at to a `current timestamp`

## CMS

### SETUP

1. From the root of the monorepo - run `npm i`
2. From the root of the monorepo - run `npm run dev:cms`

## JOBFINDER SITE

### SETUP

1. From the root of the monorepo - run `npm i`
2. From the root of the monorepo - run `npm run dev:jobfinder-site`

## TODOS 

1. api: query jobs route
2. jobfinder-site: build advanced search form
3. api: setup email templates for 
  - job application email
  - job application status update email
4. api: upload route for assets