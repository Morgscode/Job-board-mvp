const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/locationModel');
const { Job } = require('../models/jobModel');

const _index = catchAsync(async function (req, res, next) {
  const locations = await model.Location.findAll({
    attributes: req.sql.attributes,
    where: { ...req.sql.where },
    order: req.sql.order,
    ...req.pagination,
  });
  if (!locations) {
    return next(new NotFoundError('locations not found'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      locations,
      totalRecords: await model.Location.count(),
    },
  });
});

const _find = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const location = await model.Location.findOne({ where: { id } });

  if (!location) {
    return next(new NotFoundError('location not found'));
  }

  res.status(200).json({ status: 'success', data: { location } });
});

const _create = catchAsync(async function (req, res, next) {
  const location = ({ name, description } = req.body);
  const record = await model.Location.create(location);

  if (!record) {
    return next(new AppError("couldn't create that location", 500, false));
  }

  res
    .status(201)
    .json({ status: 'success', data: { location: record.toJSON() } });
});

const _update = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const location = ({ name, description } = req.body);

  if (!location) {
    return next(new AppError('missing location details', 400));
  }

  const record = await model.Location.findOne({ where: { id } });
  if (!record) {
    return next(new NotFoundError('location not found'));
  }

  const updated = await model._update(location, { id });
  if (!updated) {
    return next(new AppError('error - could not update location', 500, false));
  }

  res.status(200).json({
    status: 'success',
    data: { location: (await record.reload()).toJSON() },
  });
});

const _delete = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const deleted = await model.Location.destroy({ where: { id } });
  res.status(200).json({ status: 'success', data: { deleted } });
});

const findByJobId = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const job = await Job.findOne({ where: { id } });
  if (!job) {
    return next(new NotFoundError('job not found'));
  }

  const locations = await job.getLocations();
  res.status(200).json({
    status: 'success',
    data: {
      locations,
    },
  });
});

module.exports = { _index, _find, _create, _update, _delete, findByJobId };
