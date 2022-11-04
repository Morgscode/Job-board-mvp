const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function filterPayload(token) {
  if ('password' in token) delete token['password'];
  return token;
}

function createToken(user) {
  const payload = JSON.parse(JSON.stringify(filterPayload(user)));
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '28800',
  });
}

function verifyToken(token) {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, payload) {
      if (err) return reject(err);
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

module.exports = { createToken, verifyToken, verifyPassword };
