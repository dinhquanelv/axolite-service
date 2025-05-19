const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      minLength: 8,
      default: null,
    },
    email: {
      type: String,
      default: null,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
    },
    friends: {
      type: [ObjectId],
      ref: 'User',
      default: [],
    },
    friendsSent: {
      type: [ObjectId],
      ref: 'User',
      default: [],
    },
    friendsReceived: {
      type: [ObjectId],
      ref: 'User',
      default: [],
    },
    authType: {
      type: String,
      enum: ['local', 'google', 'facebook'],
      required: true,
      default: 'local',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', userSchema);
