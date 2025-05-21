const validator = require('validator');
const { APIError } = require('../error');
const User = require('../models/user.model');
const authUtils = require('../utils/auth');
const { isString, isNotEmpty } = require('../utils/validate');

const register = async (name, username, email, password) => {
  isNotEmpty(name, 'Name');
  isString(name, 'Name');

  isNotEmpty(username, 'Username');
  isString(username, 'Username');

  isNotEmpty(email, 'Email');
  isString(email, 'Email');

  isNotEmpty(password, 'Password');
  isString(password, 'Password');

  if (!validator.isEmail(email)) {
    throw new APIError('Email is not valid!', 400);
  }

  if (password.length < 8) {
    throw new APIError('Password must be at least 8 characters!', 400);
  }

  const existUser = await User.findOne({ username });
  if (existUser) {
    throw new APIError('Username already exists!', 400);
  }

  const hashedPassword = await authUtils.hashPassword(password);

  const newUser = new User({
    name,
    username,
    email,
    password: hashedPassword,
  });
  await newUser.save();
};

const login = async (username, password) => {
  isString(username, 'Username');
  isNotEmpty(username, 'Username');

  isString(password, 'Password');
  isNotEmpty(password, 'Password');

  const user = await User.findOne({ username });
  if (!user) {
    throw new APIError('Invalid username!', 404);
  }

  const isMatchPassword = await authUtils.comparePassword(password, user.password);
  if (!isMatchPassword) {
    throw new APIError('Invalid password!', 401);
  }

  const accessToken = authUtils.generateToken({ id: user._id }, process.env.JWT_ACCESS_KEY, '1h');
  const refreshToken = authUtils.generateToken({ id: user._id }, process.env.JWT_REFRESH_KEY, '1d');

  return { user, accessToken, refreshToken };
};

const forgotPassword = async (username, email) => {
  isNotEmpty(username, 'Username');
  isString(username, 'Username');

  isNotEmpty(email, 'Email');
  isString(email, 'Email');

  const user = await User.findOne({ username, email });
  if (!user) {
    throw new APIError('Invalid information!', 404);
  }

  const otp = authUtils.generateOPT();

  const resetToken = authUtils.generateToken({ id: user._id, otp }, process.env.JWT_RESET_KEY, '20m');
  const info = await authUtils.sendEmailToResetPassword(email, resetToken);

  return { info, resetToken };
};

const verifyOTP = (token, otp) => {
  isNotEmpty(otp, 'OTP');
  isString(otp, 'OTP');

  const decode = authUtils.verifyToken(token, process.env.JWT_RESET_KEY);
  if (!decode || decode.otp !== otp) {
    throw new APIError('Invalid OTP!', 400);
  }
};

const resetPassword = async (token, newPassword) => {
  isNotEmpty(newPassword, 'New Password');
  isString(newPassword, 'New Password');

  const decode = authUtils.verifyToken(token, process.env.JWT_RESET_KEY);
  if (!decode) {
    throw new APIError('Invalid code!', 400);
  }

  const user = await User.findById(decode.id);
  if (!user) {
    throw new APIError('User not found!', 404);
  }

  const hashedPassword = await authUtils.hashPassword(newPassword);
  user.password = hashedPassword;

  await user.save();
};

const refreshToken = (refreshToken) => {
  if (!refreshToken) {
    throw new APIError('You must be login!', 401);
  }

  const user = authUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_KEY);
  if (!user) {
    throw new APIError('Invalid refresh token!', 403);
  }

  const newAccessToken = authUtils.generateToken({ id: user.id }, process.env.JWT_ACCESS_KEY, '1h');

  return newAccessToken;
};

module.exports = {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  refreshToken,
};
