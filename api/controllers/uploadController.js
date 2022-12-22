const path = require('path');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const { FileUpload } = require('../models/fileUploadModel');
const { User, apiUser } = require('../models/userModel');
const { JobApplication } = require('../models/jobApplicationModel');

const _index = catchAsync(async (req, res, next) => {
  const uploads = await FileUpload.findAll({ ...req.query.pagination });
  if (!uploads || uploads.length === 0) {
    return next(new NotFoundError('Uploads not found'));
  }
  res.status(200).json({
    status: 'success',
    data: {
      uploads,
    },
  });
});

const _find = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const upload = await FileUpload.findOne({ where: { id } });
  if (!upload) {
    return next(new NotFoundError('upload not found'));
  }
  res.status(200).json({
    status: 'success',
    data: {
      upload,
    },
  });
});

const _create = catchAsync(async (req, res, next) => {
  const file = req.file;
  const upload = {
    title: file.originalname,
    name: file.filename,
    path: file.path,
    mimetype: file.mimetype,
    user_id: req.user.id,
  };
  const record = await FileUpload.create(upload);
  res.status(200).json({
    status: 'success',
    data: {
      upload: record,
    },
  });
});

const _update = catchAsync(async (req, res, next) => {
  const { title } = req.body;
  const { id } = req.params;

  if (!title) {
    return next(new AppError('upload details missing', 400));
  }

  const upload = await FileUpload.findOne({ where: { id } });
  if (!upload) {
    return next(new NotFoundError('upload not found'));
  }

  upload.title = title;
  await upload.save();
  res.status(200).json({
    status: 'success',
    data: {
      upload,
    },
  });
});

const _delete = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const upload = await FileUpload.findOne({ where: { id } });
  if (!upload) {
    return next(new NotFoundError('upload not found'));
  }
  const deleted = await FileUpload.destroy({ where: { id } });
  res.status(200).json({ status: 'success', data: { deleted } });
});

const download = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const upload = await FileUpload.findOne({ where: { id } });
  if (!upload) {
    return next(new NotFoundError('upload not found'));
  }
  res.status(200).sendFile(upload.dataValues.path, {
    root: path.join(__dirname, '../../'),
    headers: {
      'Content-Type': upload.mimetype,
      'Content-Disposition': `attachment; filename=${upload.name}`,
      'X-Timestamp': Date.now(),
      'X-Sent': true,
    },
  });
});

const findUploadsByUserId = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({ where: { id } });
  if (!user) {
    return next(new NotFoundError('user not found'));
  }
  const uploads = await user.getFileUploads();
  if (!uploads || uploads.length === 0) {
    return next(new NotFoundError('uploads not found'));
  }
  res.status(200).json({
    status: 'success',
    data: { user: apiUser(user.toJSON()), uploads },
  });
});

const findUploadByJobApplicationId = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const application = await JobApplication.findOne({where: {id, }});
  if (!application) {
    return next(new NotFoundError('application not found'));
  }
  const upload = await application.getFileUpload();
  if (!upload) {
    return next(new NotFoundError('upload not found'));
  } 
  res.status(200).json({
    status: "success",
    data: {
      application,
      upload,
    }
  });
});

module.exports = {
  _index,
  _find,
  _create,
  _update,
  _delete,
  download,
  findUploadsByUserId,
  findUploadByJobApplicationId,
};
