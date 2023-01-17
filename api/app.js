const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet'); 
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const relationships = require('./models/index');
const AppError = require('./utils/AppError');
const auth = require('./middleware/authentication');
const roles = require('./middleware/userRoles');
const pagination = require('./middleware/pagination');
const queryInterface = require('./middleware/queryInterface');
const time = require('./middleware/humanRequestTime');
const globalErrorHandler = require('./middleware/errors');
const userRouter = require('./routes/userRoutes');
const jobRouter = require('./routes/jobRoutes');
const jobCategoryRouter = require('./routes/jobCategoryRoutes');
const locationRouter = require('./routes/locationRoutes');
const jobApplicationRouter = require('./routes/jobApplicationsRoutes');
const uploadRouter = require('./routes/uploadRoutes');
const salaryTypeRouter = require('./routes/salaryTypeRoutes');
const employmentContractTypeRouter = require('./routes/employmentContractTypeRoutes');
const jobApplicationStatusRouter = require('./routes/jobApplicationStatusRoutes');
const meRouter = require('./routes/meRoutes');
const authController = require('./controllers/authController');
 
const app = express();
// drop express powered-by header
app.disable('x-powered-by'); 

const limit = rateLimit({ 
  max: 25000,
  windowMs: 60 * 60 * 1000, 
  messgae: 'too many requests from this ip'
});

// global middlewares

// security
app.use(helmet());
app.use(limit);
app.use(cors());
app.use(hpp());

// logging
process.env.NODE_ENV === 'production'
  ? app.use(morgan())
  : app.use(morgan('dev'));

// json with limits
app.use(express.json({limit: '256kb'}));

// serve files from public dir
app.use(express.static(path.join(__dirname, 'public')))

// api specific global middleware
app.use('/api/v1', [time, pagination, queryInterface]);

// mount routers
app.use('/api/v1/users', userRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/job-categories', jobCategoryRouter);
app.use('/api/v1/job-applications', jobApplicationRouter); 
app.use('/api/v1/job-application-statuses', jobApplicationStatusRouter);
app.use('/api/v1/employment-contract-types', employmentContractTypeRouter);
app.use('/api/v1/salary-types', salaryTypeRouter);
app.use('/api/v1/locations', locationRouter);
app.use('/api/v1/uploads', uploadRouter);
app.use('/api/v1/me', meRouter);

// root route
app.get('/api/v1', async function (req, res, next) {
  res.status(200).json({ 
    status: 'success',    
    data: {  
      message: 'Welcome to OJB version 1',
    },
  });
});

// auth routes
app.post('/api/v1/register', authController.register);
app.post('/api/v1/login', authController.login);
app.post('/api/v1/request-email-verify', authController.requestEmailVerify);
app.get('/api/v1/verify-email', authController.verifyEmail); 
app.post('/api/v1/forgot-password', authController.forgotPassword);
app.get('/api/v1/reset-password', authController.verifyPasswordResetToken);
app.use('/api/v1/update-password', [auth.protect, auth.emailVerified, roles.jobBoardUser]);
app.put('/api/v1/update-password', authController.updatePassword);

// not found route
app.all('*', (req, res, next) => {
  next(new AppError(`cannot find ${req.originalUrl}`));
});

// use error controller globally
app.use(globalErrorHandler);

module.exports = app;
