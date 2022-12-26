const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/userModel');
const auth = require('../utils/auth');
const mailer = require('../utils/mailer');
const { JobApplication } = require('../models/jobApplicationModel');
const { FileUpload } = require('../models/fileUploadModel');
 
const _index = catchAsync(async function (req, res, next) {
  const users = await model.User.findAll({
    attributes: req.sql.attributes,
    where: { ...req.sql.where },
    order: req.sql.order,
    ...req.pagination,
  });
  if (!users) {
    return next(new NotFoundError('users not found'));
  }

  const apiUsers = users.map(user => model.apiUser(user.toJSON()));
  res.status(200).json({ status: 'success', data: { users: apiUsers } });
});

const _find = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const user = await model.User.findOne({ where: { id } });

  if (!user) {
    return next(new NotFoundError('user not found'));
  }

  res.status(200).json({ status: 'success', data: { user: model.apiUser(user.toJSON()) }});
});

const _create = catchAsync(async function (req, res, next) {
  const user = ({ email, first_name, surname, title, middle_names } = req.body);
  const { password, role } = req.body;

  if (!user.email || !password) {
    return next(new AppError('user details incorrect', 400));
  }

  const userExists = await model.userEmailExists(user.email);
  if (userExists) {
    return next(new AppError(`email address already exists`, 400));
  }

  if (password.length < 8) {
    return next(new AppError('passwords must be at least 8 characters', 400));
  }

  if (parseInt(role, 10) !== 1 && parseInt(role, 10) !== 2) {
    return next(new AppError('user details incorrect', 400));
  }

  const newUser = await model.registerUser(user, password, role);
  if (!newUser) {
    return next(new AppError('error - unable to create newUser', 500, false));
  }

  // set verify token 
  const verify = auth.createAppToken();
  newUser.email_verify_token = verify.hash;
  await newUser.save();

  // send email
  mailer.options.to = newUser.email;
  mailer.options.subject = 'Please verify your email';
  mailer.options.text = `<a href="${process.env.API_DOMAIN}/verify-email?email=${newUser.email}&token=${verify.token}">verify email</a>`;
  await mailer.send();

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


const findByUploadId = catchAsync(async function(req, res, next) {

});

const findByJobApplicationId = catchAsync(async function(req, res, next) {

});

module.exports = {
  _index,
  _find,
  _create,
  _update,
  _delete,
  findByUploadId,
  findByJobApplicationId
};
