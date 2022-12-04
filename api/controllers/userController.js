const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/userModel');
const auth = require('../utils/auth');
const mailer = require('../utils/mailer');

const _index = catchAsync(async function (req, res, next) {
  const users = await model.User.findAll({
    attributes: req.sql.attributes,
    where: { ...req.sql.where },
    order: req.sql.order,
    ...req.pagination,
  });

  if (!users || users?.length === 0) {
    return next(new NotFoundError('users not found'));
  }

  res.status(200).json({ status: 'success', data: { users } });
});

const _find = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const user = await model.User.findOne({ where: { id } });

  if (!user) {
    return next(new NotFoundError('user not found'));
  }

  res.status(200).json({ status: 'success', data: { user } });
});

const _create = catchAsync(async function (req, res, next) {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return next(new AppError('user details incorrect', 400));
  }

  const userExists = await model.userEmailExists(email);
  if (userExists) {
    return next(new AppError(`email address already exists`, 400));
  }

  if (password.length < 8) {
    return next(new AppError('passwords must be at least 8 characters', 400));
  }

  if (parseInt(role, 10) !== 1 && parseInt(role, 10) !== 2) {
    return next(new AppError('user details incorrect', 400));
  }

  const user = await model.registerUser(email, password, role);
  if (!user) {
    return next(new AppError('error - unable to create user', 500, false));
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
    status: 'success',
    data: { user: user.dataValues },
  });
});

const _update = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const { user } = req.body;

  if (!user) {
    return next(new AppError('missing user details', 400));
  }

  const record = await model.User.findOne({ where: { id } });
  if (!record) {
    return next(new NotFoundError('user not found'));
  }

  const updated = await model._update(user, { id });
  if (!updated) {
    return next(new AppError('error - unable to update user', 500, false));
  }

  res.status(200).json({ status: 'success', data: { updated } });
});

const _delete = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const user = await model.User.findOne({where: { id, }});
  if (!user) {
    return next(new NotFoundError('user not found'));
  }

  // only admins can delete admins
  if (user.role === 3 && req.user.role !== 3) {
    return next(new AppError('not authorized', 401));
  }

  const deleted = await model.User.destroy({ where: { id } });
  res.status(200).json({ status: 'success', data: { deleted } });
});

module.exports = {
  _index,
  _find,
  _create,
  _update,
  _delete,
};
