const dotenv = require('dotenv');
const error = require('./utils/handleUncaughtException');

dotenv.config({ path: `${__dirname}/config/config.env` });

switch (process.env.NODE_ENV) {
  case 'development':
    dotenv.config({ path: `${__dirname}/config/development.env` });
    break;
  case 'production':
    dotenv.config({ path: `${__dirname}/config/production.env` });
    break;
}
