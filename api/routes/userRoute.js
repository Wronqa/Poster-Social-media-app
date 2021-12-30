const { body, validationResult, check } = require('express-validator')
const express = require('express')
const router = express.Router()
const uniqid = require('uniqid')
const bcrypt = require('bcrypt')

const User = require('../models/User')

const { verify } = require('../jwtManager')

router.get('/:username', verify, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })

    const { _id, email, password, createdAt, updatedAt, __v, ...other } =
      user.toJSON()

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
})
router.put('/:username/follow', verify, async (req, res) => {
  const username = req.username

  try {
    const user = await User.findOne({ username: req.params.username })
    const currentUser = await User.findOne({ username })

    if (user.followers.includes(username)) {
      const userIndex = user.followers.indexOf(username)

      user.followers.splice(userIndex, 1)

      const currentUserIndex = currentUser.followings.indexOf(user.username)
      currentUser.followings.splice(currentUserIndex, 1)

      await user.save()
      await currentUser.save()
    } else {
      user.followers.push(username)
      currentUser.followings.push(user.username)

      user.save()
      currentUser.save()
    }
    res.status(200).json('User has been followed')
  } catch (err) {
    res.status(500).json(err)
  }
})

router.put(
  '/edit',
  verify,
  check('city').escape(),

  async (req, res) => {
    const username = req.username
    try {
      const updatedUser = await User.findOneAndUpdate(
        { username: username },
        {
          $set: {
            city: req.body.city,
            relationship: req.body.relationship,
          },
        },
        { new: true }
      )
      res.status(200).json(updatedUser)
    } catch (err) {
      res.status(500).json(err)
    }
  }
)

router.put(
  '/password',
  verify,
  check('password')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('Fields cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  check('newPassword')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('Fields cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  check('confrimPasword')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Fields cannot be empty')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match password')
      }
      return true
    }),
  async (req, res) => {
    const errorList = validationResult(req)

    if (!errorList.isEmpty()) {
      res.status(403).json(errorList.errors[0])
    } else {
      const username = req.username
      const { password, confrimPasword, newPassword } = req.body

      if (confrimPasword !== newPassword) {
        res.status(500).json('Passwords must best the same')
      } else {
        try {
          const user = await User.findOne({ username })

          bcrypt.compare(password, user.password, (err, result) => {
            if (!result) {
              res.status(404).json({ msg: 'Wrong password' })
            } else {
              bcrypt.genSalt(+process.env.SALT_ROUNDS, (err, salt) => {
                bcrypt.hash(newPassword, salt, async (err, hash) => {
                  if (!err) {
                    ///nie jestem pewien
                    await user.updateOne({ $set: { password: hash } })
                    res.status(200).json('Password changed successfully')
                  } else {
                    res.status(500)
                  }
                })
              })
            }
          })
        } catch (err) {
          res.status(500).json(err)
        }
      }
    }
  }
)

router.put('/avatar', verify, async (req, res) => {
  const username = req.username

  try {
    const user = await User.findOneAndUpdate(
      { username },
      { $set: { profilePicture: req.body.picture } },
      { new: true }
    )

    const { _id, email, password, createdAt, updatedAt, __v, ...other } =
      user.toJSON()

    res.status(200).json(other)
  } catch (err) {
    res.status(500).json(err)
  }
})
router.put('/background', verify, async (req, res) => {
  const username = req.username

  try {
    const user = await User.findOneAndUpdate(
      { username },
      { $set: { coverPicture: req.body.picture } },
      { new: true }
    )

    const { _id, email, password, createdAt, updatedAt, __v, ...other } =
      user.toJSON()

    res.status(200).json(other)
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get('/:username/friends', verify, async (req, res) => {
  try {
    const currentUser = await User.findOne({ username: req.params.username })
    const friends = await Promise.all(
      currentUser.followings.map((friend) => {
        return User.findOne({ username: friend })
      })
    )

    const filteredFriends = friends
      .filter((friend) => friend != null)
      .map((friend) => {
        const { _id, username, city, profilePicture, ...others } =
          friend.toJSON()

        if (friend != null) return { username, city, profilePicture }
      })

    res.status(200).json(filteredFriends)
  } catch (err) {
    res.status(500).json(err)
  }
})
router.get('/:username/picture', verify, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })

    res.status(200).json(user.profilePicture)
  } catch (err) {
    res.status(500).json(err)
  }
})
router.get(
  '/search/:username',
  verify,
  check('username').escape().trim(),
  async (req, res) => {
    const username = req.username
    try {
      const users = await User.find({
        $and: [
          { username: { $regex: req.params.username, $options: 'i' } },
          { username: { $ne: username } },
        ],
      }).limit(4)

      const filteredUsers = users
        .filter((user) => user !== null)
        .map((user) => {
          const { username, profilePicture, city, ...others } = user.toJSON()

          return { username, profilePicture, city }
        })

      res.status(200).json(filteredUsers)
    } catch (err) {
      res.status(500).json(err)
    }
  }
)

module.exports = router
