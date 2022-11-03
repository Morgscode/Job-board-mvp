const env = require('./utils/env');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const authController = require('./controllers/authController');

const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(morgan());
} else {
    app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());

app.use(function(req, res, next) {
    const time = new Date().toISOString();
    req.requestTime = time;
    next();
});

app.post('/register', authController.register);
app.post('/login', authController.login); 

module.exports = app;