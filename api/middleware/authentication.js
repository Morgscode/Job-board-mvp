const auth = require('../utils/auth');
const AppError = require('../utils/AppError');

async function protect(req, res, next) {
  let token = req?.headers?.authorization?.split('Bearer ')[1];
  if (!token) {
    return next(new AppError(`Not authorized`, 401));
  }
  const payload = await auth.verifyToken(token);
  req.user = payload.user;
  next();
}

async function emailVerified(req, res, next) {
  let user = req.user;
  if (!user.emailVerifiedAt) {
    return next(new AppError(`Email not verified`, 401));
  }
  next();
}

module.exports = {
  protect,
  emailVerified,
};
