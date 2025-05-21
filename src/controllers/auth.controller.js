const { toBoolean } = require('validator');
const authServices = require('../services/auth.service');

const authController = {
  // [POST] /api/auth/register
  register: async (req, res, next) => {
    try {
      const { name, username, email, password } = req.body;

      await authServices.register(name, username, email, password);

      return res.status(201).json({ message: 'Register successfully!' });
    } catch (error) {
      next(error);
    }
  },

  // [POST] /api/auth/login
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const data = await authServices.login(username, password);
      if (data) {
        // store tokens in cookies
        res.cookie('accessToken', data.accessToken, {
          httpOnly: true,
          secure: toBoolean(process.env.COOKIES_SECURE),
          sameSite: process.env.COOKIES_SAME_SITE,
          maxAge: 60 * 60 * 1000, // 1h
        });
        res.cookie('refreshToken', data.refreshToken, {
          httpOnly: true,
          secure: toBoolean(process.env.COOKIES_SECURE),
          sameSite: process.env.COOKIES_SAME_SITE,
          maxAge: 24 * 60 * 60 * 1000, // 1d
        });

        const { password, ...others } = data.user._doc;

        return res.status(200).json({ ...others });
      }
    } catch (error) {
      next(error);
    }
  },

  // [DELETE] /api/auth/logout
  logout: (req, res, next) => {
    try {
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: toBoolean(process.env.COOKIES_SECURE),
        sameSite: process.env.COOKIES_SAME_SITE,
      });
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: toBoolean(process.env.COOKIES_SECURE),
        sameSite: process.env.COOKIES_SAME_SITE,
      });

      return res.status(200).json({ message: 'Log out successfully!' });
    } catch (error) {
      next(error);
    }
  },

  // [POST] /api/auth/password/forgot
  forgotPassword: async (req, res, next) => {
    try {
      const { username, email } = req.body;

      const data = await authServices.forgotPassword(username, email);

      res.cookie('resetToken', data.resetToken, {
        httpOnly: true,
        secure: toBoolean(process.env.COOKIES_SECURE),
        sameSite: process.env.COOKIES_SAME_SITE,
        maxAge: 20 * 60 * 1000, // 20m
      });

      return res.status(200).json(data.info);
    } catch (error) {
      next(error);
    }
  },

  // [POST] /api/auth/password/otp/verify
  verifyOTP: (req, res, next) => {
    try {
      const resetToken = req.cookies?.resetToken;
      const { otp } = req.body;

      authServices.verifyOTP(resetToken, otp);

      return res.status(200).json({ message: 'OTP verified successfully!' });
    } catch (error) {
      next(error);
    }
  },

  // [POST] /api/auth/password/reset
  resetPassword: async (req, res, next) => {
    try {
      const resetToken = req.cookies?.resetToken;
      const { newPassword } = req.body;

      await authServices.resetPassword(resetToken, newPassword);

      return res.status(200).json({ message: 'Reset password successfully!' });
    } catch (error) {
      next(error);
    }
  },

  // [POST] /api/auth/token/refresh
  refreshToken: (req, res, next) => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      const newAccessToken = authServices.refreshToken(refreshToken);

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: toBoolean(process.env.COOKIES_SECURE),
        sameSite: process.env.COOKIES_SAME_SITE,
        maxAge: 60 * 60 * 1000, // 1h
      });

      return res.status(200).json({ message: 'Refresh token successfully!' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
