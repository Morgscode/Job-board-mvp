const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const { User, apiUser } = require('../models/userModel');
const { JobApplication } = require('../models/jobApplicationModel');
const { FileUpload } = require('../models/fileUploadModel');

const _index = catchAsync(async function (req, res, next) {
  const user = await User.findOne({ where: { id: req.user.id } });
  res.status(200).json({
    status: 'success',
    data: { user: apiUser(user.toJSON()) },
  });
});

const getJobApplications = catchAsync(async function (req, res, next) {
  const user = await User.findOne({ where: { id: req.user.id } });
  const applications = await user.getJobApplications();
  res.status(200).json({
    status: 'success',
    data: { applications },
  });
});

const getFileUploads = catchAsync(async function (req, res, next) {
  const user = await User.findOne({ where: { id: req.user.id } });
  const uploads = await user.getFileUploads();
  res.status(200).json({
    status: 'success',
    data: { uploads },
  });
});

module.exports = {
  _index,
  getJobApplications,
  getFileUploads,
};
