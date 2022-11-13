const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/jobCategoryModel');

const _index = catchAsync(async function (req, res, next) {
  const categories = await model.JobCategory.findAll({ ...req.pagination });

  if (!categories || categories?.length === 0) {
    return next(new NotFoundError("we couldn't find any job categories"));
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
    return next(new NotFoundError("we couldn't find that category"));
  }

  res.status(200).json({ status: 'success', data: { category } });
});

const _create = catchAsync(async function (req, res, next) {
  const category = ({ name, description, active } = req.body);
  const record = await model.JobCategory.create(category);

  if (!record) {
    return next(new AppError("we couldn't create that job category", 500));
  }

  res.status(201).json({ status: 'success', data: { category: record } });
});

const _update = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const { category } = req.body;

  if (!category) {
    return next(new AppError('you need to pass in some category details', 400));
  }

  const record = await model.JobCategory.findOne({ where: { id } });
  if (!record) {
    return next(new NotFoundError("we couldn't find that record"));
  }

  const updated = await model._update(category, { id });
  if (!updated) {
    return next(new AppError("we couldn't update that category", 500));
  }

  res.status(200).json({ status: 'success', data: { updated } });
});

const _delete = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const deleted = await model.JobCategory.destroy({ where: { id } });
  res.status(200).json({ status: 'success', data: { deleted } });
});

module.exports = { _index, _find, _create, _update, _delete };
