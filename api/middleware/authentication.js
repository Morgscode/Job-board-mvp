const auth = require('../utils/auth');
const AppError = require('../utils/AppError');

async function protect(req, res, next) {
  let token = req?.headers?.authorization?.split('Bearer ')[1];
  if (!token) {
    return next(new AppError(`Not authorized`, 401));
  }
  try {
    const payload = await auth.verifyJWT(token);
    req.user = payload.user;
  } catch (error) {
    console.error(error);
    return next(new AppError(`Not authorized`, 401));
  }

  next();
}

async function emailVerified(req, res, next) {
  let user = req.user;
  if (!user.email_verified_at) {
    return next(new AppError(`Email not verified`, 401));
  }
  next();
}

module.exports = {
  protect,
  emailVerified,
};
