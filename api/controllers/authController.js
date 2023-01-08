const crypto = require('crypto');
const moment = require('moment');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const auth = require('../utils/auth');
const userModel = require('../models/userModel');
const mailer = require('../utils/mailer');

const register = catchAsync(async function (req, res, next) {
  const user = ({ email, first_name, surname, title, middle_names } = req.body);
  const { password } = req.body;

  if (!user.email || !password) {
    return next(new AppError(`incomplete signup`, 400));
  }

  if (password.length < 8) {
    return next(new AppError(`password must be at least 8 characters`, 400));
  }

  const userExists = await userModel.userEmailExists(user.email);
  if (userExists) {
    return next(new AppError(`email address already exists`, 400));
  }

  const newUser = await userModel.registerUser(user, password);
  if (!newUser) {
    return next(new AppError(`there was a problem creating your account`, 500));
  }

  await userModel.requestEmailVerify(newUser);

  res.status(201).json({
    status: 'sucess',
    data: {
      message: 'registered! please verify your email address',
      user: userModel.apiUser(newUser.toJSON()),
    },
  });
});

const requestEmailVerify = catchAsync(async function(req, res, next) {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('those details are not correct', 400));
  }

  const user = await userModel.User.findOne({ where: { email } });
  if (!user) {
    return next(new AppError('those details are not correct', 404));
  }

  if (user.email_verified_at !== null) {
    return next(new AppError('those details are not correct', 400));
  }

  await userModel.requestEmailVerify(user);

  res.status(204);
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

  if (hash !== user.email_verify_token) {
    return next(new AppError('not authroized', 401));
  }

  const now = moment().format();
  user.email_verified_at = now;
  await user.save();

  const jwt = auth.createJWT(user.toJSON());
  if (!jwt) {
    return next(new AppError("we couldn't log you in", 500));
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

const login = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('those details are not correct', 400));
  }

  const user = await userModel.loginUser(email, password);
  if (!user) {
    return next(new AppError('those details are not correct', 401));
  }

  if (!user.email_verified_at) {
    return next(new AppError('please verify your email', 401));
  }

  const token = await auth.createJWT(user);
  res.status(200).json({
    status: 'sucess',
    data: {
      message: 'user logged in',
      user: userModel.apiUser(user),
    },
    token,
  });
});

const forgotPassword = catchAsync(async function (req, res, next) {
  const { email } = req.body;

  console.log(email);

  const user = await userModel.User.findOne({ where: { email } });
  if (!user) {
    return next(new AppError('those details are not correct', 404));
  }

  const reset = auth.createAppToken();
  user.password_reset_token = reset.hash;
  user.password_reset_expires = moment().add(15, 'minutes');
  await user.save();

  mailer.options.to = user.email;
  mailer.options.subject = 'Password reset request';
  mailer.options.text = `<a href="${process.env.JOBFINDER_SITE_URL}/reset-password?email=${user.email}&token=${reset.token}">reset password</a>`;

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
    return next(new AppError('those details are not correct', 400));
  }
  // check if token is valid
  const hash = crypto.createHash('sha256').update(token).digest('hex');

  if (!user.password_reset_token) {
    return next(new AppError('not authroized', 401));
  }

  if (hash !== user.password_reset_token) {
    return next(new AppError('not authroized', 401));
  }

  const now = moment();
  if (!now.isBefore(user.password_reset_expires)) {
    return next(new AppError('not authroized', 401));
  }

  const jwt = await auth.createJWT(user.toJSON());
  if (!jwt) {
    return next(new AppError("we couldn't log you in", 500));
  }

  res.send({
    status: 'success',
    data: {
      user: userModel.apiUser(user.toJSON()),
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

module.exports = {
  register,
  verifyEmail,
  requestEmailVerify,
  login,
  forgotPassword,
  verifyPasswordResetToken,
  updatePassword,
};
