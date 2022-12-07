const crypto = require('crypto');
const moment = require('moment');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const auth = require('../utils/auth');
const userModel = require('../models/userModel');
const mailer = require('../utils/mailer');

const register = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(`incomplete signup`, 400));
  }

  if (password.length < 8) {
    return next(new AppError(`password must be at least 8 characters`, 400));
  }

  const userExists = await userModel.userEmailExists(email);
  if (userExists) {
    return next(new AppError(`email address already exists`, 400));
  }

  const user = await userModel.registerUser(email, password);
  if (!user) {
    return next(new AppError(`there was a problem creating your account`, 500));
  }

  // set verify token
  const verify = auth.createCryptoToken();
  user.emailVerifyToken = verify.hash;
  await user.save();

  // send email
  mailer.options.to = user.email;
  mailer.options.subject = 'Please verify your email';
  mailer.options.text = `<a href="${process.env.API_DOMAIN}/verify-email?email=${user.email}&token=${verify.token}">verify email</a>`;
  await mailer.send();

  res.status(201).json({
    status: 'sucess',
    data: {
      message: 'registered! please verify your email address',
      user: user.dataValues,
    },
  });
});

const login = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(`incomplete login attempts`, 400));
  }

  const user = await userModel.loginUser(email, password);
  if (!user) {
    return next(new AppError('those details are not correct', 401));
  }

  if (!user.emailVerifiedAt) {
    return next(new AppError('please verify your email', 401));
  }

  const token = await auth.createJWT(user);
  res.status(200).json({
    status: 'sucess',
    data: {
      message: 'user logged in',
      user,
    },
    token,
  });
});

const forgotPassword = catchAsync(async function (req, res, next) {
  const { email } = req.body;

  const user = await userModel.User.findOne({ where: { email } });
  if (!user) {
    return next(new AppError('those details are not correct', 404));
  }

  const reset = auth.createCryptoToken();
  user.passwordResetToken = reset.hash;
  user.passwordResetExpires = moment().add(15, 'minutes');
  await user.save();

  mailer.options.to = user.email;
  mailer.options.subject = 'Password reset request';
  mailer.options.text = `<a href="${process.env.API_DOMAIN}/reset-password?email=${user.email}&token=${reset.token}">reset password</a>`;
  await mailer.send();

  res.status(200).send({
    status: 'success',
    data: {
      message: 'Password reset sent',
      token: reset.token,
    },
  });
});

const verifyPasswordResetToken = catchAsync(async function (req, res, next) {
  const { email, token } = req.query;
  if (!email || !token) {
    return next(new AppError('those details are not correct', 400));
  }

  const user = await userModel.User.findOne({ where: { email } });
  if (!user) {
    return next(new AppError('those details are not correct', 404));
  }
  // check if token is valid
  const hash = crypto.createHash('sha256').update(token).digest('hex');

  if (hash !== user.passwordResetToken) {
    return next(new AppError('not authroized', 401));
  }

  const now = moment();
  if (!now.isBefore(user.passwordResetExpires)) {
    return next(new AppError('not authroized', 401));
  }

  const jwt = await auth.createJWT(user.toJSON());
  if (!jwt) {
    return next(new AppError("we couldn't log you in", 500));
  }

  res.send({
    status: 'success',
    data: {
      user: { id: user.id, email: user.email },
      token: jwt,
    },
  });
});

const updatePassword = catchAsync(async function (req, res, next) {
  const { password, passwordConfirm } = req.body;
  const { id } = req.user;

  if (!password || !passwordConfirm) {
    return next(new AppError('you need to provide a password', 400));
  }

  if (password.length < 8) {
    return next(new AppError('passwords must be at least 8 characters', 400));
  }

  if (password !== passwordConfirm) {
    return next(new AppError('password does not match the confirmation', 400));
  }

  const user = await userModel.User.findOne({ where: { id } });
  if (!user) {
    return next(new AppError("we coudld'nt find that user", 500));
  }

  await userModel.updatePassword(user, password);

  res.send({
    status: 'success',
    data: {
      message: 'password updated',
    },
  });
});

const verifyEmail = catchAsync(async function (req, res, next) {
  const { email, token } = req.query;
  if (!email || !token) {
    return next(new AppError('those details are not correct', 400));
  }

  const user = await userModel.User.findOne({ where: { email } });
  if (!user) {
    return next(new AppError('those details are not correct', 404));
  }
  // check if token is valid
  const hash = crypto.createHash('sha256').update(token).digest('hex');

  if (hash !== user.emailVerifyToken) {
    return next(AppError('not authroized', 401));
  }

  const now = moment().format();
  user.emailVerifiedAt = now;
  await user.save();

  const jwt = await auth.createJWT(user.toJSON());
  if (!jwt) {
    return next(AppError("we couldn't log you in", 500));
  }

  res.send({
    status: 'success',
    data: {
      message: 'email verified',
      user: { id: user.id, email: user.email },
      token: jwt,
    },
  });
});

module.exports = {
  register,
  login,
  forgotPassword,
  verifyPasswordResetToken,
  updatePassword,
  verifyEmail,
};
