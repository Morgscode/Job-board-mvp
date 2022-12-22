const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/salaryTypeModel');
const { Job } = require('../models/jobModel');

const _index = catchAsync(async function (req, res, next) {
  const salaryTypes = await model.SalaryType.findAll({
    attributes: req.sql.attributes,
    where: { ...req.sql.where },
    order: req.sql.order,
    ...req.pagination,
  });
  if (!salaryTypes) {
    return next(new NotFoundError('salary types not found'));
  }

  res.status(200).json({
    status: 'success',
    data: { salaryTypes },
  });
});

const _find = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const salaryType = await model.SalaryType.findOne({ where: { id } });

  if (!salaryType) {
    return next(new NotFoundError('salaryType not found'));
  }

  res.status(200).json({ status: 'success', data: { salaryType } });
});

const _create = catchAsync(async function (req, res, next) {
  const { name } = req.body;
  const record = await model.SalaryType.create({ name });

  if (!record) {
    return next(new AppError("couldn't create that salary type", 500, false));
  }

  res.status(201).json({ status: 'success', data: { salaryType: record } });
});

const _update = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const { salaryType } = req.body;

  if (!salaryType) {
    return next(new AppError('missing location details', 400));
  }

  const record = await model.SalaryType.findOne({ where: { id } });
  if (!record) {
    return next(new NotFoundError('location not found'));
  }

  const updated = await model._update(salaryType, { id });
  if (!updated) {
    return next(
      new AppError('error - could not update salary type', 500, false)
    );
  }

  res.status(200).json({ status: 'success', data: { updated } });
});

const _delete = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const deleted = await model.SalaryType.destroy({ where: { id } });
  res.status(200).json({ status: 'success', data: { deleted } });
});

const findByJobId = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const record = await Job.findOne({ where: { id } });
  if (!record) {
    return next(new NotFoundError('job not found'));
  }
  console.log(record);
  const salaryType = await record.getSalaryType();
  if (!salaryType) {
    return next(new NotFoundError('salary type not found for that job'));
  }
  res
    .status(200)
    .json({ status: 'success', data: { salaryType, job: record } });
});

module.exports = { _index, _find, _create, _update, _delete, findByJobId };
