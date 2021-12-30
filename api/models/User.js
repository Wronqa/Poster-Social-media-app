const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      min: 5,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    city: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: 'default_avatar.png',
    },
    coverPicture: {
      type: String,
      default: '',
      default: 'default_cover.png',
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    relationship: {
      type: Number,
      default: 3,
      enoum: [1, 2, 3],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
