const jwt = require('jsonwebtoken');
const { promisfy } = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Email = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

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
  await new Email(newUser).sendWelcome();
  createToken(newUser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or password', 401));
  }
  createToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //Getting the token first from the header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }
  //Verifying the token gotten from the header
  const verifyToken = await promisfy(jwt.verify)(token, process.env.JWT_SECRET);
  //Checking if the user exists
  const tokenUser = await User.findById(verifyToken.id);
  if (!tokenUser) {
    return next(new AppError('User this token does not exist', 401));
  }
  //Checking if the user changed password after the token was issued
  if (tokenUser.changedPasswordAfter(verifyToken.iat)) {
    return next(
      new AppError('User changed password recently! Please log in again', 401)
    );
  }
  //Grant access to protected route
  req.user = tokenUser;
  next();
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('No user with that email', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetLink = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  await new Email(user).sendPasswordReset();
  res.status(200).json({
    status: 'success',
    resetLink,
    message: 'Token sent to email',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  const passwordToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: passwordToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password');
  if (!user) {
    return next(new AppError('Invalid or Expired token', 400));
  }
  if (password !== confirmPassword) {
    return next(new AppError('Passwords do not match', 400));
  }
  if (await user.correctPassword(password, user.password)) {
    return next(
      new AppError('New password cannot be the same as the old one', 400)
    );
  }
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  await new Email(user).sendPasswordChanged();
  createToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  createToken(user, 200, res);
});
