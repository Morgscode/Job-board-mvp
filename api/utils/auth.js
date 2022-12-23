const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');
const AppError = require('../utils/AppError');

function filterPayload(payload) {
  if ('password' in payload) delete payload['password'];
  if ('email' in payload) delete payload['email'];
  if ('title' in payload) delete payload['title'];
  if ('first_name' in payload) delete payload['first_name'];
  if ('surname' in payload) delete payload['surname'];
  if ('middle_names' in payload) delete payload['middle_names'];
  if ('password_reset_token' in payload) delete payload['password_reset_token'];
  if ('password_reset_expires' in payload)
    delete payload['password_reset_expires'];
  if ('password_refreshed_at' in payload)
    delete payload['password_refreshed_at'];
  if ('email_verify_token' in payload) delete payload['email_verify_token'];
  return payload;
}

function createJWT(user) {
  if (!user) {
    throw new Error('no payload passed to jwt');
  }
  const payload = filterPayload({...user});
  return jwt.sign({ user: payload }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });
}

function verifyJWT(token) {
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
  verifyJWT,
  verifyPassword,
  createAppToken,
};
