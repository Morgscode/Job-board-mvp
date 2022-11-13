const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const relationships = require('./models/index');
const AppError = require('./utils/AppError');
const pagination = require('./utils/pagination');
const queryInterface = require('./utils/queryInterface');
const time = require('./utils/humanRequestTime');
const jobRouter = require('./routes/jobRoutes');
const jobCategoryRouter = require('./routes/jobCategoryRoutes');
const locationRouter = require('./routes/locationRoutes');
const globalErrorHandler = require('./controllers/errorController');
const authController = require('./controllers/authController');

const app = express();

process.env.NODE_ENV === 'production'
  ? app.use(morgan())
  : app.use(morgan('dev'));

app.use(cors());
app.use(express.json());
app.use(helmet());
app.disable('x-powered-by');

// global middleware
app.use('/api/v1', [time, pagination, queryInterface]);

// mount routers
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/job-categories', jobCategoryRouter);
app.use('/api/v1/locations', locationRouter);

// root route
app.get('/api/v1', function (req, res) {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'welcome to version 1!',
    },
  });
});

// auth routes
app.post('/register', authController.register);
app.post('/login', authController.login);

// not found route
app.all('*', (req, res, next) => {
  next(new AppError(`cannot find ${req.originalUrl}`));
});

// use error controller globally
app.use(globalErrorHandler);

module.exports = app;
