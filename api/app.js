const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const relationships = require('./models/index');
const AppError = require('./utils/AppError');
const catchAsync = require('./utils/catchAsyncError');
const auth = require('./utils/auth');
const pagination = require('./utils/pagination');
const queryInterface = require('./utils/queryInterface');
const time = require('./utils/humanRequestTime');
const jobRouter = require('./routes/jobRoutes');
const jobCategoryRouter = require('./routes/jobCategoryRoutes');
const locationRouter = require('./routes/locationRoutes');
const jobApplicationRouter = require('./routes/jobApplicationsRoutes');
const globalErrorHandler = require('./controllers/errorController');
const authController = require('./controllers/authController');

const app = express();
const limit = rateLimit({
  max: 250,
  windowMs: 60 * 60 * 1000,
  messgae: 'too many requests from this ip'
});

// drop express powered-by header
app.disable('x-powered-by');

process.env.NODE_ENV === 'production'
  ? app.use(morgan())
  : app.use(morgan('dev'));

// global middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(limit);
app.use('/api/v1', [time, pagination, queryInterface]);

// mount routers
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/job-categories', jobCategoryRouter);
app.use('/api/v1/locations', locationRouter);
app.use('/api/v1/job-applications', jobApplicationRouter);

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
app.post('/api/v1/register', authController.register);
app.post('/api/v1/login', authController.login);
app.post('/api/v1/forgot-password', authController.forgotPassword);
app.get('/api/v1/reset-password', authController.verifyPasswordResetToken);
app.use('/api/v1/update-password', [auth.protect, auth.jobBoardUser]);
app.put('/api/v1/update-password', authController.updatePassword);

// not found route
app.all('*', (req, res, next) => {
  next(new AppError(`cannot find ${req.originalUrl}`));
});

// use error controller globally
app.use(globalErrorHandler);

module.exports = app;
