const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/jobApplicationModel');
const { Job } = require('../models/jobModel');

const _index = catchAsync(async function (req, res, next) {
  const applications = await model.JobApplication.findAll({
    ...req.pagination,
  });

  if (!applications || applications?.length === 0) {
    return next(new NotFoundError("we couldn't find any job applications"));
  }

  res.status(200).json({
    status: 'success',
    data: { applications },
  });
});

const _find = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const application = await model.JobApplication.findOne({ where: { id } });

  if (!application) {
    return next(new NotFoundError("we couldn't find that application"));
  }

  res.status(200).json({ status: 'success', data: { application } });
});

const _create = catchAsync(async function (req, res, next) {
  const application = ({ jobId, coveringLetter } = req.body);
  application.UserId = req.user.id;
  const record = await model.JobApplication.create(application);

  if (!record) {
    return next(new AppError("we couldn't create that job application", 500));
  }
  // set status relationship
  await record.setJobApplicationStatus(1);

  res.status(201).json({ status: 'success', data: { application: record } });
});

const _update = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const { application, status } = req.body;

  if (!application) {
    return next(
      new AppError('you need to pass in some application details', 400)
    );
  }

  const record = await model.JobApplication.findOne({ where: { id } });
  if (!record) {
    return next(new NotFoundError("we couldn't find that job"));
  }

  if (status) {
    // set status relationship
    await record.setJobApplicationStatus(status);
  }

  const updated = await model._update(application, { id });
  if (!updated) {
    return next(new AppError("we couldn't update that application", 500));
  }

  res.status(200).json({ status: 'success', data: { updated } });
});

const _delete = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const deleted = await model.JobApplication.destroy({ where: { id } });
  res.status(200).json({ status: 'success', data: { deleted } });
});

const findApplicationsByJobId = catchAsync(async function (req, res, next) {
  const { id } = req.params;

  const job = await Job.findOne({ where: { id } });
  if (!job) {
    return next(new NotFoundError("we couldn't find that job"));
  }

  const applications = await job.getJobApplications();
  if (!applications || applications?.length === 0) {
    return next(new NotFoundError("we couldn't find any job applications for that job"));
  }

  res.status(200).json({
    status: 'success',
    data: { job, applications },
  });
});

module.exports = {
  _index,
  _find,
  _create,
  _update,
  _delete,
  findApplicationsByJobId,
};
