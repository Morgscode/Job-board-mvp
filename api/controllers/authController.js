const auth = require('../utils/auth');
const userModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');

const register = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(`incomplete signup`, 400));
  }

  const userExists = await userModel.userEmailExists(email);
  if (userExists) {
    return next(new AppError(`email address already exists`, 400));
  }

  const user = await userModel.registerUser(email, password);
  if (!user) {
    return next(new AppError(`there was a problem creating your account`, 500));
  }

  const token = auth.createToken({ id: user, email, role: '1' });
  res.status(201).json({
    status: 'sucess',
    data: {
      message: 'registered!',
      user,
    },
    token,
  });
});

const login = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(`incomplete login attempts`, 400));
  }

  const user = await userModel.loginUser(email, password);
  if (!user) {
    return next(new AppError('those details are not correct', 401));
  }

  const token = await auth.createToken(user);
  res.status(201).json({
    status: 'sucess',
    data: {
      message: 'user logged in',
      user,
    },
    token,
  });
});

module.exports = { register, login };
