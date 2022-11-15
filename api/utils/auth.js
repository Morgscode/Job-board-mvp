const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

function createPasswordResetToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
}

async function protect(req, res, next) {
  let token = req?.headers?.authorization?.split('Bearer ')[1];
  if (!token) {
    return next(new AppError(`Not authorized`, 401));
  }
  const payload = await verifyToken(token);
  req.user = payload.user;
  next();
}

async function jobBoardUser(req, res, next) {
  let user = req.user;
  if (user.role === 1 || user.role === 2 || user.role === 3) {
    return next();
  }
  return next(new AppError(`Not authorized`, 401));
}

async function jobBoardRecruiter(req, res, next) {
  let user = req.user;
  if (user.role === 2 || user.role === 3) {
    return next();
  }
  return next(new AppError(`Not authorized`, 401));
}

async function jobBoardAdmin(req, res, next) {
  let user = req.user;
  if (user.role === 3) {
    return next();
  }
  return next(new AppError(`Not authorized`, 401));
}

module.exports = {
  createJWT,
  verifyToken,
  verifyPassword,
  createPasswordResetToken,
  protect,
  jobBoardUser,
  jobBoardRecruiter,
  jobBoardAdmin
};
