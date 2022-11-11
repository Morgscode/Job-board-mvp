const error = require('./handleUncaughtException');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config.env` });

switch (process.env.NODE_ENV) {
  case 'development':
    dotenv.config({ path: `${__dirname}/../development.env` });
    break;
  case 'production':
    dotenv.config({ path: `${__dirname}/../produciton.env` });
    break;
}
