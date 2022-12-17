const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');
const AppError = require('../utils/AppError');

function filterPayload(payload) {
  if ('password' in payload) delete payload['password'];
  if ('email' in payload) delete payload['email'];
  if ('title' in payload) delete payload['title'];
  if ('firstName' in payload) delete payload['firstName'];
  if ('surname' in payload) delete payload['surname'];
  if ('middleNames' in payload) delete payload['middleNames'];
  if ('passwordResetToken' in payload) delete payload['passwordResetToken'];
  if ('passwordResetExpires' in payload) delete payload['passwordResetExpires'];
  if ('passwordRefreshedAt' in payload) delete payload['passwordRefreshedAt'];
  if ('emailVerifyToken' in payload) delete payload['emailVerifyToken'];
  return payload;
}

function createJWT(user) {
  if (!user) {
    throw new Error('no payload passed to jwt');
  }
  const payload = JSON.parse(JSON.stringify(filterPayload(user)));
  return jwt.sign({ user: payload }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });
}

function verifyToken(token) {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, payload) {
      if (err) {
        return reject(err);
      }
      resolve(payload);
    });
  });
}

function verifyPassword(password, hash) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(password, hash, function (err, match) {
      if (err) return reject(err);
      resolve(match);
    });
  });
}

function createAppToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
}

module.exports = {
  createJWT,
  verifyToken,
  verifyPassword,
  createAppToken,
};
