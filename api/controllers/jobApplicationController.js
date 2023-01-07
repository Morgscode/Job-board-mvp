const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/jobApplicationModel');
const { Job } = require('../models/jobModel');
const { User, apiUser } = require('../models/userModel');
const { FileUpload } = require('../models/fileUploadModel');
const { JobApplicationStatus } = require('../models/jobApplicationStatusModel');

const _index = catchAsync(async function (req, res, next) {
  const applications = await model.JobApplication.findAll({
    attributes: req.sql.attributes,
    where: { ...req.sql.where },
    order: req.sql.order,
    ...req.pagination,
  });

  if (!applications) {
    return next(new NotFoundError('job applications not found'));
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
    return next(new NotFoundError('job application not found'));
  }

  res.status(200).json({ status: 'success', data: { application } });
});

const _create = catchAsync(async function (req, res, next) {
  const application = ({ job_id, cover_letter } = req.body);
  application.user_id = req.user.id;

  const cv = req.file;
  if (!job_id || !cover_letter || !cv) {
    return next(new AppError('missing applcation details', 400));
  }

  const job = await Job.findOne({ where: { id: job_id } });
  if (!job) {
    return next(new AppError('job not found', 404));
  }

  if (job.active !== 1) {
    return next(new AppError('job not open for applications', 400));
  }

  // uplaod file - if fail - 500
  const upload = {
    title: cv.originalname,
    name: cv.filename,
    path: cv.path,
    mimetype: cv.mimetype,
    user_id: req.user.id,
  };
  const file = await FileUpload.create(upload);
  if (!file) {
    return next(new AppError('error - unable to save cv file', 500, false));
  }

  const record = await model.JobApplication.create(application);
  if (!record) {
    return next(
      new AppError('error - unable to create job application', 500, false)
    );
  }
  // set status relationships
  await record.setFileUpload(file);
  await record.setJobApplicationStatus(1);

  res
    .status(201)
    .json({ status: 'success', data: { application: record.toJSON() } });
});

const _update = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const { job_application_status_id } = req.body;

  if (!job_application_status_id) {
    return next(new AppError('missing job application details', 400));
  }

  const record = await model.JobApplication.findOne({ where: { id } });
  if (!record) {
    return next(new NotFoundError('job not found'));
  }

  if (job_application_status_id) {
    // set job_application_status_id relationship
    await record.setJobApplicationStatus(job_application_status_id);
  }

  res
    .status(200)
    .json({ status: 'success', data: { application: record.toJSON() } });
});

const _delete = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const deleted = await model.JobApplication.destroy({ where: { id } });
  res.status(200).json({ status: 'success', data: { deleted } });
});

const withdraw = catchAsync(async function (req, res, next) {
  const { id } = req.params;

  const application = await model.JobApplication.findOne({ where: { id } });
  if (!application) {
    return next(new NotFoundError('job not found'));
  }

  if (application.user_id !== req.user.id) {
    return next(new AppError('not authorized', 401));
  }

  await application.setJobApplicationStatus(5);

  res
    .status(200)
    .json({ status: 'success', data: { application: application.toJSON() } });
});

const findByJobId = catchAsync(async function (req, res, next) {
  const { id } = req.params;

  const job = await Job.findOne({ where: { id } });
  if (!job) {
    return next(new NotFoundError('job not found'));
  }

  const applications = await job.getJobApplications();
  if (!applications) {
    return next(new NotFoundError('applications not found for job'));
  }
  res.status(200).json({
    status: 'success',
    data: { applications },
  });
});

const findByUserId = catchAsync(async function (req, res, next) {
  const { id } = req.params;

  const user = await User.findOne({ where: { id } });
  if (!user) {
    return next(new NotFoundError('user not found'));
  }

  const applications = await user.getJobApplications();
  if (!applications) {
    return next(new NotFoundError('applications not found for user'));
  }
  res.status(200).json({
    status: 'success',
    data: { applications },
  });
});

const findByJobApplicationStatusId = catchAsync(async function (
  req,
  res,
  next
) {
  const { id } = req.params;
  const status = await JobApplicationStatus.findOne({ where: { id } });

  const applications = await status.getJobApplications();
  res.status(200).json({
    status: 'success',
    data: { applications },
  });
});

module.exports = {
  _index,
  _find,
  _create,
  _update,
  _delete,
  withdraw,
  findByJobId,
  findByUserId,
  findByJobApplicationStatusId,
};
