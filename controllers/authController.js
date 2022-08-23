const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.checkEmail = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return next(new AppError('Email already exists', 400));
  }
  next();
});

exports.setRole;

exports.signUp = catchAsync(async (req, res, next) => {
  const { email, name, password, passwordConfirm } = req.body;

  const firstAccount = (await User.countDocuments({})) === 0;
  const role = firstAccount ? 'user' : 'admin';

  const newUser = await User.create({
    name,
    email,
    role,
    password,
    passwordConfirm,
  });
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  res.status(200).json({
    status: 'success',
  });
});
