const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/jobCategoryModel');

const _index = catchAsync(async function (req, res, next) {
  const categories = await model.JobCategory.findAll({ ...req.pagination });

  if (!categories || categories?.length === 0) {
    return next(new NotFoundError("job categories not found"));
  }

  res.status(200).json({
    status: 'success',
    data: { categories,  },
  });
});

const _find = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const category = await model.JobCategory.findOne({ where: { id } });

  if (!category) {
    return next(new NotFoundError("job category not found"));
  }

  res.status(200).json({ status: 'success', data: { category } });
});

const _create = catchAsync(async function (req, res, next) {
  const category = ({ name, description, active } = req.body);
  const record = await model.JobCategory.create(category);

  if (!record) {
    return next(new AppError("error - unable to create job category", 500, false));
  }

  res.status(201).json({ status: 'success', data: { category: record } });
});

const _update = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const { category } = req.body;

  if (!category) {
    return next(new AppError('missing job category details', 400));
  }

  const record = await model.JobCategory.findOne({ where: { id } });
  if (!record) {
    return next(new NotFoundError("job not found"));
  }

  const updated = await model._update(category, { id });
  if (!updated) {
    return next(new AppError("error - unable to update job category", 500, false));
  }

  res.status(200).json({ status: 'success', data: { updated } });
});

const _delete = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const deleted = await model.JobCategory.destroy({ where: { id } });
  res.status(200).json({ status: 'success', data: { deleted } });
});

module.exports = { _index, _find, _create, _update, _delete };
