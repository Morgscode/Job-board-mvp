const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/userModel');

const _index = catchAsync(async function (req, res, next) {
  const user = await model.User.findOne({ where: { id: req.user.id } });
  res.status(200).json({
    status: 'success',
    data: { user: model.apiUser(user.toJSON()) },
  });
});

const _update = catchAsync(async function (req, res, next) {
  const user = ({ title, first_name, surname, middle_names } = req.body);

  const record = await model.User.findOne({ where: { id: req.user.id } });
  if (!record) {
    return next(new NotFoundError('user not found'));
  }

  const updated = await model._update(user, { id: req.user.id });
  if (!updated) {
    return next(new AppError('error - unable to update user', 500, false));
  }

  res
    .status(200)
    .json({
      status: 'success',
      data: { user: model.apiUser((await record.reload()).toJSON()) },
    });
});

const getJobApplications = catchAsync(async function (req, res, next) {
  const user = await model.User.findOne({ where: { id: req.user.id } });
  const applications = await user.getJobApplications();
  res.status(200).json({
    status: 'success',
    data: { applications },
  });
});

const getFileUploads = catchAsync(async function (req, res, next) {
  const user = await model.User.findOne({ where: { id: req.user.id } });
  const uploads = await user.getFileUploads();
  res.status(200).json({
    status: 'success',
    data: { uploads },
  });
});

module.exports = {
  _index,
  _update,
  getJobApplications,
  getFileUploads,
};
