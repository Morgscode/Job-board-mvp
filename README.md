# OJB - Open Job Board Monorepo

This monorepo is powered for devleopment and production using NPM workspaces (https://docs.npmjs.com/cli/v7/using-npm/workspaces)

## Requirements

- Node.js 16.16.0
- NPM 7.24.2
- MySQL 5.7

## API

- At its core - the ojb api is an express application. This means you can build on top of the core api like you would any other express application (https://expressjs.com/).

#### SETUP

- API Environment

  1. Set your root environment in `./api/config/config.env` to either `development` or `production` or `whateverenvyoulike`
  2. Then create a file for you environment and fill in the following variables i.e. `development.env` or `production.env` or `whateverenvyoulike.env`
  
     ```API_DOMAIN=http://localhost:8080/api/v1
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


- Custom environments

    Out of the box - OJB comes configured to handle `production` and `development` environment. You can create extra environments by following the naming conventions explained above. Be sure to load your env in the switch statement in `./api/env.js`

- Database seeding - An exmaple setup shell script `./api/dev-data/app-setup.js` is provided to create some jobs, categories and locations.

  1. copy `example.setup.sh` to `setup.sh` into the root of the project.
  2. enter your db credentials to pass into the setup script.
  3. run the setup script.

## ADMIN CLIENT

## JOBFINDER SITE
