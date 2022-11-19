const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/jobApplicationModel');
const { Job } = require('../models/jobModel');
const { User } = require('../models/userModel');
const { FileUpload } = require('../models/fileUploadModel');

const _index = catchAsync(async function (req, res, next) {
  const applications = await model.JobApplication.findAll({
    ...req.pagination,
  });

  if (!applications || applications?.length === 0) {
    return next(new NotFoundError("job applications not found"));
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
    return next(new NotFoundError("job application not found"));
  }

  res.status(200).json({ status: 'success', data: { application } });
});

const _create = catchAsync(async function (req, res, next) {
  const application = ({ JobId, coveringLetter } = req.body);
  application.UserId = req.user.id;

  const cv = req.file;
  if (!JobId || !coveringLetter || !cv) {
    return next(new AppError('missing applcation details', 400));
  }

  const job = await Job.findOne({where: { id: JobId}});
  if (!job) {
    return next(new AppError("job not found", 404));
  }

  // uplaod file - if fail - 500 
  const upload = {
    title: cv.originalname,
    name: cv.filename,
    path: cv.path,
    mimetype: cv.mimetype,
    UserId: req.user.id,
  }
  const file = await FileUpload.create(upload);
  if (!file) {
    return next(new AppError("error - unable to save cv file", 500, false));
  }

  application.CvId = file.id;

  const jobApplication = await model.JobApplication.create(application); 
  if (!jobApplication) {
    return next(new AppError("error - unable to create job application", 500, false));
  }
  // set status relationship
  await jobApplication.setJobApplicationStatus(1);
 
  res.status(201).json({ status: 'success', data: { jobApplication, } });
});

const _update = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const { application, status } = req.body;

  if (!application) {
    return next(
      new AppError('missing job application details', 400)
    );
  }

  const record = await model.JobApplication.findOne({ where: { id } });
  if (!record) {
    return next(new NotFoundError("job not found"));
  }

  if (status) {
    // set status relationship
    await record.setJobApplicationStatus(status);
  }

  const updated = await model._update(application, { id });
  if (!updated) {
    return next(new AppError("error - unable to update jobs", 500, false));
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
    return next(new NotFoundError("job not found"));
  }

  const applications = await job.getJobApplications();
  if (!applications || applications?.length === 0) {
    return next(
      new NotFoundError("applications not found for job")
    );
  }

  res.status(200).json({
    status: 'success',
    data: { job, applications },
  });
});

const findApplicationsByUserId = catchAsync(async function (req, res, next) {
  const { id } = req.params;

  const user = await User.findOne({ where: { id } });
  if (!user) {
    return next(new NotFoundError("user not found"));
  }

  const applications = await user.getJobApplications();
  if (!applications || applications?.length === 0) {
    return next(
      new NotFoundError("applications not found for user")
    );
  }

  res.status(200).json({
    status: 'success',
    data: { user, applications },
  });
});

module.exports = {
  _index,
  _find,
  _create,
  _update,
  _delete,
  findApplicationsByJobId,
  findApplicationsByUserId,
};
