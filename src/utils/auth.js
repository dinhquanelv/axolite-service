const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, userPassword) => {
  return await bcrypt.compare(password, userPassword);
};

const generateToken = (payload, jwtKey, time) => {
  return jwt.sign(payload, jwtKey, { expiresIn: time });
};

const verifyToken = (token, jwtKey) => {
  try {
    return jwt.verify(token, jwtKey);
  } catch (err) {
    console.log(err);
  }
};

const generateOPT = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmailToResetPassword = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const decode = verifyToken(resetToken, process.env.JWT_RESET_KEY);
  const resetCode = decode.otp;

  const info = await transporter.sendMail({
    from: `"Axolite" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${resetCode} - Your Axolite security code`,
    html: `<div style="max-width: 480px; width: 100%; margin: auto">
          <h2 style="padding: 8px; font-size: 28px">Axolite</h2>

          <p style="padding: 8px; font-size: 18px">Hello!</p>

          <p style="padding: 8px; font-size: 18px">To complete the password reset process, please enter the code below:</p>

          <h1 style="letter-spacing: 2px; padding: 8px; font-size: 28px">${resetCode}</h1>

          <p style="padding: 8px; font-size: 18px">
            This code is valid for 20 minutes and can only be used once.
            By entering this code, you confirm that you are the owner of this email address.
          </p>

          <p style="padding: 8px; font-size: 18px">If you did not request a password reset, you can ignore this email.</p>

          <p style="padding: 8px; font-size: 18px">Best regards,<br/>Axolite</p>
          </div>`,
  });

  return info;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  generateOPT,
  sendEmailToResetPassword,
};
