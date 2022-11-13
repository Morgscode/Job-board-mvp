const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const relationships = require('./models/index');
const { Op } = require('sequelize');
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

if (process.env.NODE_ENV === 'production') {
  app.use(morgan());
} else {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());

// global middleware
app.use('/api/v1', [time, pagination, queryInterface]);

// mount routers
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/job-categories', jobCategoryRouter);
app.use('/api/v1/locations', locationRouter);

app.get('/api/v1', function (req, res) {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'welcome to version 1!',
    },
  });
});

app.post('/register', authController.register);
app.post('/login', authController.login);

app.all('*', (req, res, next) => {
  next(new AppError(`cannot find ${req.originalUrl}`));
});

app.use(globalErrorHandler);

module.exports = app;
