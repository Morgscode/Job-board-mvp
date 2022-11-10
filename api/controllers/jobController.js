const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/jobModel');

const _index = catchAsync(async function (req, res, next) {
  const jobs = await model.Job.findAll();
  if (!jobs || jobs?.length === 0) {
    return next(new NotFoundError("we couldn't find any jobs"));
  }
  res
    .status(200)
    .json({ status: 'success', data: { jobs, count: jobs.length } });
});

const _find = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const job = await model.Job.findOne({ where: { id } });
  if (!job) {
    return next(new NotFoundError("we couldn't find that job"));
  }
  res.status(200).json({ status: 'success', data: { job } });
});

const _create = catchAsync(async function (req, res, next) {
  const job = ({ title, salary, salaryType, description, deadline } = req.body);
  const record = await model.Job.create(job);
  if (!record) {
    return next(new AppError("we couldn't create that job", 500));
  }
  res.status(201).json({ status: 'success', data: { job: record } });
});

const _update = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const { job } = req.body;
  if (!job) {
    return next(new AppError("we couldn't update that job", 400));
  }
  const updated = await model._update(job, { id });
  if (!updated) {
    return next(new AppError("we couldn't update that job", 500));
  }
  res.status(200).json({ status: 'success', data: { updated } });
});

const _delete = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("we couldn't delete that job", 400));
  }
  const deleted = await model.Job.destroy({ where: { id } });
  res.status(200).json({ status: 'success', data: { deleted } });
});

module.exports = { _index, _find, _create, _update, _delete };
