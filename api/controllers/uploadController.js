const path = require('path');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const { FileUpload } = require('../models/fileUploadModel');
const { User } = require('../models/userModel');

const _find = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const upload = await FileUpload.findOne({ where: { id } });
  if (!upload) {
    return next(new NotFoundError("upload not found"));
  }
  res.setStatus(200).sendFile(upload.dataValues.path, {
    root: path.join(__dirname, '../../'),
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
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
    data: { user, uploads },
  });
});

module.exports = { _find, findUploadsByUserId };
