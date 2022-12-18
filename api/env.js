const dotenv = require('dotenv');

process.on('uncaughtException', async function (err) {
  console.error(err.name, err.message);
  console.log('exiting...');
  process.exit(1);
});

if (!process.env.APP_ENV_LOADED) {
  dotenv.config({ path: `${__dirname}/config/config.env` });

  switch (process.env.NODE_ENV) {
    case 'development':
      dotenv.config({ path: `${__dirname}/config/development.env` });
      break;
    case 'production':
      dotenv.config({ path: `${__dirname}/config/production.env` });
      break;
  }
}
