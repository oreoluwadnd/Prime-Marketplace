const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
exports.checkEmail = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return next(new AppError('Email already exists', 400));
  }
  next();
});
exports.setAdmin = catchAsync(async (req, res, next) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? 'admin' : 'user';
  next();
});

exports.signUp = catchAsync(async (req, res, next) => {
  const { email, name, password, confirmPassword, role } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
    role,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
      token,
    },
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or password', 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    data: {
      user,
      token,
    },
  });
});
