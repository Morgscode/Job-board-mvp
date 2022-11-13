const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/locationModel');

const _index = catchAsync(async function (req, res, next) {
  const locations = await model.Location.findAll({ ...req.pagination });

  if (!locations || locations?.length === 0) {
    return next(new NotFoundError("we couldn't find any job locations"));
  }

  res.status(200).json({
    status: 'success',
    data: { locations, },
  });
});

const _find = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const location = await model.Location.findOne({ where: { id } });

  if (!location) {
    return next(new NotFoundError("we couldn't find that location"));
  }

  res.status(200).json({ status: 'success', data: { location } });
});

const _create = catchAsync(async function (req, res, next) {
  const location = ({ name, description, active } = req.body);
  const record = await model.Location.create(location);

  if (!record) {
    return next(new AppError("we couldn't create that job location", 500));
  }

  res.status(201).json({ status: 'success', data: { location: record } });
});

const _update = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const { location } = req.body;

  if (!location) {
    return next(new AppError('you need to pass in some location details', 400));
  }

  const record = await model.Location.findOne({ where: { id } });
  if (!record) {
    return next(new NotFoundError("we couldn't find that location"));
  }

  const updated = await model._update(location, { id });
  if (!updated) {
    return next(new AppError("we couldn't update that location", 500));
  }

  res.status(200).json({ status: 'success', data: { updated } });
});

const _delete = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const deleted = await model.Location.destroy({ where: { id } });
  res.status(200).json({ status: 'success', data: { deleted } });
});

module.exports = { _index, _find, _create, _update, _delete };
