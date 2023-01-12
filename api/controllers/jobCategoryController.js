const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/jobCategoryModel');
const { Job } = require('../models/jobModel');

const _index = catchAsync(async function (req, res, next) {
  const categories = await model.JobCategory.findAll({
    attributes: req.sql.attributes,
    where: { ...req.sql.where },
    order: req.sql.order,
    ...req.pagination,
  });
  if (!categories) {
    return next(new NotFoundError('job categories not found'));
  }

  res.status(200).json({
    status: 'success',
    data: { 
      categories, 
      totalRecords: await model.JobCategory.count() 
    },
  });
});

const _find = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const category = await model.JobCategory.findOne({ where: { id } });

  if (!category) {
    return next(new NotFoundError('job category not found'));
  }

  res.status(200).json({ status: 'success', data: { category } });
});

const _create = catchAsync(async function (req, res, next) {
  const category = ({ name, description, active } = req.body);
  const record = await model.JobCategory.create(category);

  if (!record) {
    return next(
      new AppError('error - unable to create job category', 500, false)
    );
  }

  res
    .status(201)
    .json({ status: 'success', data: { category: record.toJSON() } });
});

const _update = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const category = ({ name, description } = req.body);

  if (!category) {
    return next(new AppError('missing job category details', 400));
  }

  const record = await model.JobCategory.findOne({ where: { id } });
  if (!record) {
    return next(new NotFoundError('job not found'));
  }

  const updated = await model._update(category, { id });
  if (!updated) {
    return next(
      new AppError('error - unable to update job category', 500, false)
    );
  }

  res
    .status(200)
    .json({
      status: 'success',
      data: { category: (await record.reload()).toJSON() },
    });
});

const _delete = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const deleted = await model.JobCategory.destroy({ where: { id } });
  res.status(200).json({ status: 'success', data: { deleted } });
});

const findByJobId = catchAsync(async function (req, res, user) {
  const { id } = req.params;
  const job = await Job.findOne({ where: { id } });
  if (!job) {
    return next(new NotFoundError('job not found'));
  }
  const categories = await job.getCategory();
  res.status(200).json({
    status: 'success',
    data: {
      categories,
    },
  });
});

module.exports = { _index, _find, _create, _update, _delete, findByJobId };
