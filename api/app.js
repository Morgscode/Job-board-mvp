const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { Op } = require('sequelize');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const authController = require('./controllers/authController');
const jobRouter = require('./routes/jobRoutes');
const jobCategoryRouter = require('./routes/jobCategoryRoutes');
const locationRouter = require('./routes/locationRoutes');
const relationships = require('./models/index'); 


const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(morgan());
} else {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());

// global middleware for adding a human readable request time to all requests
app.use(function (req, res, next) {
  const time = new Date().toISOString();
  req.requestTime = time; 
  next();
});

// global middleware for handling pagination
app.use(function(req, res, next) {
  const query = {...req.query};
  req.pagination = { limit: parseInt(query.limit, 10) || 20, offset: parseInt(query.offset, 10) || 0 };
  next();
});

// global middleware for field queries
app.use(function(req, res, next) {
  const query = {...req.query};
  console.log(query);
  const exclude = ['page', 'sort', 'limit', 'fields', 'title', 'description', 'name', 'id'];
  exclude.forEach(item => delete query[item]); 
  req.sql = {};
  req.sql.where = {...query};
  if (req.query.title) {
    req.sql.where['title'] = {[Op.like]: `${decodeURI(req.query.title)}%`};
  }
  if (req.query.name) {
    req.sql.where['name'] = {[Op.like]: `${decodeURI(req.query.name)}%`};
  }
  next();
});

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
