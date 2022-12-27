const path = require('path');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const { FileUpload } = require('../models/fileUploadModel');
const { User, apiUser } = require('../models/userModel');
const { JobApplication } = require('../models/jobApplicationModel');

const _index = catchAsync(async (req, res, next) => {
  const uploads = await FileUpload.findAll({
    attributes: req.sql.attributes,
    where: { ...req.sql.where },
    order: req.sql.order,
    ...req.pagination,
  });
  if (!uploads) {
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
      upload: record.toJSON(),
    },
  });
});

const _update = catchAsync(async (req, res, next) => {
  const { title } = req.body;
  const { id } = req.params;

  if (!title) {
    return next(new AppError('upload details missing', 400));
  }

  const record = await FileUpload.findOne({ where: { id } });
  if (!record) {
    return next(new NotFoundError('upload not found'));
  }

  upload.title = title;
  await upload.save();
  res.status(200).json({
    status: 'success',
    data: {
      upload: record.toJSON(),
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
  res.status(200).download(upload.dataValues.path, encodeURI(upload.title));
});

const findByUserId = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({ where: { id } });

  if (!user) {
    return next(new NotFoundError('user not found'));
  }

  const uploads = await user.getFileUploads();
  if (!uploads) {
    return next(new NotFoundError('uploads not found'));
  }
  res.status(200).json({
    status: 'success',
    data: { uploads },
  });
});

const findByJobApplicationId = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const application = await JobApplication.findOne({ where: { id } });

  if (!application) {
    return next(new NotFoundError('application not found'));
  }

  const upload = await application.getFileUpload();
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

module.exports = {
  _index,
  _find,
  _create,
  _update,
  _delete,
  download,
  findByUserId,
  findByJobApplicationId,
};
