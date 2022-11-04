const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function filterPayload(token) {
  if ('password' in token) delete token['password'];
  return token;
}

function createToken(user) {
  const payload = JSON.parse(JSON.stringify(filterPayload(user)));
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });
}

function verifyToken(token) {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, payload) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(payload);
    });
  });
}

function verifyPassword(password, hash) {
  console.log(password, hash);
  return new Promise(function (resolve, reject) {
    bcrypt.compare(password, hash, function (err, match) {
      if (err) return reject(err);
      resolve(match);
    });
  });
}

async function protect(req, res, next) {
  let token = req?.headers?.authorization?.split('Bearer ')[1];
  console.log(token);

  if (!token) {
    return res.status(401).json({
      status: 'failed',
      data: {
        message: 'you shall not pass',
      },
    });
  }

  try {
    const payload = await verifyToken(token);
    console.log(payload);
    next();
  } catch (error) {
    res.status(401).json({
      status: 'failed',
      data: {
        message: 'you shall not pass',
      },
    });
  }
}

module.exports = { createToken, verifyToken, verifyPassword, protect };
