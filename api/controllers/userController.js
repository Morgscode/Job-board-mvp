const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/userModel');

const _index = catchAsync(async function (req, res, next) {
  const users = await model.User.findAll({
    attributes: req.sql.attributes,
    where: { ...req.sql.where },
    order: req.sql.order,
    ...req.pagination,
  });
  const apiUsers = users?.map((user) => model.apiUser(user.toJSON())) || [];
  res.status(200).json({
    status: 'success',
    data: {
      users: apiUsers,
      totalRecords: await model.User.count(),
    },
  });
});

const _find = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const user = await model.User.findOne({ where: { id } });

  if (!user) {
    return next(new NotFoundError('user not found'));
  }

  res
    .status(200)
    .json({ status: 'success', data: { user: model.apiUser(user.toJSON()) } });
});

const _create = catchAsync(async function (req, res, next) {
  const user = ({ email, first_name, surname, title, middle_names } = req.body);
  const { password, role } = req.body;

  if (!user.email) {
    return next(new AppError('user details incorrect', 400));
  }

  const userExists = await model.userEmailExists(user.email);
  if (userExists) {
    return next(new AppError(`email address already exists`, 400));
  }

  const newUser = await model.registerUser(user, password, role);
  if (!newUser) {
    return next(new AppError('error - unable to create newUser', 500, false));
  }

  await model.requestEmailVerify(newUser);

  res.status(201).json({
    status: 'success',
    data: { user: model.apiUser(newUser.toJSON()) },
  });
});

const _update = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const user = ({ title, first_name, surname, middle_names } = req.body);

  const record = await model.User.findOne({ where: { id } });
  if (!record) {
    return next(new NotFoundError('user not found'));
  }

  const updated = await model._update(user, { id });
  if (!updated) {
    return next(new AppError('error - unable to update user', 500, false));
  }

  res.status(200).json({
    status: 'success',
    data: { user: model.apiUser(record.toJSON()) },
  });
});

const _delete = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const user = await model.User.findOne({ where: { id } });
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
