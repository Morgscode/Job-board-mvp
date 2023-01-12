const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/jobApplicationStatusModel');
const { JobApplication } = require('../models/jobApplicationModel');

const _index = catchAsync(async function (req, res, next) {
  const statuses = await model.JobApplicationStatus.findAll({
    attributes: req.sql.attributes,
    where: { ...req.sql.where },
    order: req.sql.order,
    ...req.pagination,
  });
  if (!statuses) {
    return next(new NotFoundError('job application statuses not found'));
  }

  res.status(200).json({
    status: 'success',
    data: { 
      statuses, 
      totalRecords: await model.JobApplicationStatus.count() 
    },
  });
});

const _find = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const status = await model.JobApplicationStatus.findOne({ where: { id } });

  if (!status) {
    return next(new NotFoundError('job status not found'));
  }

  res.status(200).json({ status: 'success', data: { status } });
});

const _create = catchAsync(async function (req, res, next) {
  const status = ({ name } = req.body);
  const record = await model.JobApplicationStatus.create(status);

  if (!record) {
    return next(
      new AppError('error - unable to create job status', 500, false)
    );
  }

  res
    .status(201)
    .json({ status: 'success', data: { status: record.toJSON() } });
});

const _update = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const status = ({ name } = req.body);

  if (!status) {
    return next(new AppError('missing job application status details', 400));
  }

  const record = await model.JobApplicationStatus.findOne({ where: { id } });
  if (!record) {
    return next(new NotFoundError('job not found'));
  }

  const updated = await model._update(status, { id });
  if (!updated) {
    return next(
      new AppError(
        'error - unable to update job application status',
        500,
        false
      )
    );
  }

  res
    .status(200)
    .json({
      status: 'success',
      data: { status: (await record.reload()).toJSON() },
    });
});

const _delete = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const deleted = await model.JobApplicationStatus.destroy({ where: { id } });
  res.status(200).json({ status: 'success', data: { deleted } });
});

const findByJobApplicationId = catchAsync(async function (req, res, user) {
  const { id } = req.params;
  const application = await JobApplication.findOne({ where: { id } });
  if (!application) {
    return next(new NotFoundError('job application not found'));
  }
  const status = await application.getJobApplicationStatus();
  res.status(200).json({
    status: 'success',
    data: {
      status,
    },
  });
});

module.exports = {
  _index,
  _find,
  _create,
  _update,
  _delete,
  findByJobApplicationId,
};
