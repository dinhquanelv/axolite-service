const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

// authentication
router.post('/register', authController.register);
router.post('/login', authController.login);
router.delete('/logout', authController.logout);

// password recovery
router.post('/password/forgot', authController.forgotPassword);
router.post('/password/otp/verify', authController.verifyOTP);
router.post('/password/reset', authController.resetPassword);

// token management
router.post('/token/refresh', authController.refreshToken);

module.exports = router;
