const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const auth = require('./utils/auth');
const authController = require('./controllers/authController');
const jobRouter = require('./routes/jobRoutes');

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

app.use('/api/v1/jobs', jobRouter);

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

module.exports = app;
