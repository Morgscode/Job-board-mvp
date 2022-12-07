# OJB - Open Job Board Monorepo

This monorepo is powered for devleopment and production using NPM workspaces (https://docs.npmjs.com/cli/v7/using-npm/workspaces)

## Requirements

- Node.js 16.16.0
- NPM 7.24.2
- MySQL 5.7

## API

- At its core - the ojb api is an express application. This means you can build on top of the core api like you would any other express application (https://expressjs.com/).

#### SETUP

- Database seeding - An exmaple setup shell script ```./api/dev-data/app-setup.js``` is provided to create some jobs, categories and locations.

    1) copy ```example.setup.sh``` to ```setup.sh``` into the root of the project.
    2) enter your db credentials to pass into the setup script.
    3) run the setup script.

## ADMIN CLIENT

## JOBFINDER SITE