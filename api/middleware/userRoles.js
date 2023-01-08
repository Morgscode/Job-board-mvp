const AppError = require('../utils/AppError');

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
  jobBoardUser,
  jobBoardRecruiter,
  jobBoardAdmin,
};
