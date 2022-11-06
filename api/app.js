const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const auth = require('./utils/auth');
const authController = require('./controllers/authController');
const jobRouter = require('./routes/jobRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const relationships = require('./models/index');

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(morgan());
} else {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
  const time = new Date().toISOString();
  req.requestTime = time;
  next();
});

app.get('/api/v1', function (req, res) {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'welcome to version 1!',
    },
  });
});

app.use('/api/v1/jobs', jobRouter);

app.post('/register', authController.register);
app.post('/login', authController.login);

app.all('*', (req, res, next) => {
  next(new AppError(`cannot find ${req.originalUrl}`));
}); 

app.use(globalErrorHandler);

module.exports = app;