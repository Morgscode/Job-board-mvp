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
  const application = ({ JobId, coveringLetter } = req.body);
  application.UserId = req.user.id;

  const cv = req.file;
  if (!JobId || !coveringLetter || !cv) {
    return next(new AppError('missing applcation details', 400));
  }

  const job = await Job.findOne({where: { id: JobId}});
  if (!job) {
    return next(new AppError("we couldn't find that job that job", 404));
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
    return next(new AppError("we couldn't save your cv", 500));
  }

  application.CvId = file.id;

  const jobApplication = await model.JobApplication.create(application); 
  if (!jobApplication) {
    return next(new AppError("we couldn't create that job application", 500));
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
    return next(
      new NotFoundError("we couldn't find any job applications for that job")
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
    return next(new NotFoundError("we couldn't find that user"));
  }

  const applications = await user.getJobApplications();
  if (!applications || applications?.length === 0) {
    return next(
      new NotFoundError("we couldn't find any job applications for that user")
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
