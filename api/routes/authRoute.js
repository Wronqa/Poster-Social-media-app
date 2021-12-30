const { body, validationResult, check } = require('express-validator')
const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

const { generateAccessToken } = require('../jwtManager')
const { generateRefreshToken } = require('../jwtManager')
const { verify } = require('../jwtManager')

const jwt_decode = require('jwt-decode')

let tokens = []

router.post(
  '/register',
  check('email')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('Fields cannot be empty')
    .isEmail()
    .withMessage('Invalid adress email')
    .custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject('E-mail already in use')
        }
      })
    }),
  check('password')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('Fields cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  check('passwordConfirmation')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Fields cannot be empty')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password')
      }
      return true
    }),
  check('username')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('Fields cannot be empty')
    .isLength({ min: 5 })
    .withMessage('Username must be at least 5 characters')
    .isLength({ max: 10 })
    .withMessage('Username must be max 10 characters')
    .custom((value) => {
      return User.findOne({ username: value }).then((user) => {
        if (user) {
          return Promise.reject('User with this username is already exist ')
        }
      })
    }),
  check('city')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('Fields cannot be empty')
    .isAlpha()
    .withMessage('City field cannot contains number'),

  async (req, res) => {
    const errorList = validationResult(req)

    if (!errorList.isEmpty()) {
      res.status(403).json(errorList.errors[0])
    } else {
      const { username, email, password, city } = req.body

      bcrypt.genSalt(+process.env.SALT_ROUNDS, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          const user = new User({
            username,
            email,
            password: hash,
            city,
          })

          try {
            await user.save()
            res.status(200).json('Register successfully')
          } catch {
            res.status(500).json(err)
          }
        })
      })
    }
  }
)

router.post(
  '/login',
  check('email')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('Fields cannot be empty')
    .isEmail()
    .withMessage('Invalid adress email'),
  check('password')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('Fields cannot be empty'),
  async (req, res) => {
    const errorList = validationResult(req)
    if (!errorList.isEmpty()) {
      res.status(403).json(errorList.errors[0])
    } else {
      const { email, password } = req.body

      try {
        const user = await User.findOne({ email })

        if (!user) {
          res.status(404).json({ msg: 'Invalid username or password' })
        } else {
          bcrypt.compare(password, user.password, (err, result) => {
            if (!result)
              !result && res.status(404).json({ msg: 'Wrong password' })
            else {
              const accessToken = generateAccessToken(user.username)
              const refreshToken = generateRefreshToken(user.username)

              const expirationTime = jwt_decode(accessToken).exp

              tokens.push(refreshToken)

              res.cookie(
                'refresh_token',
                {
                  refreshToken,
                },
                {
                  path: '/auth/',
                  httpOnly: true,
                  secure: true,
                }
              )
              res.cookie(
                'access_token',
                {
                  accessToken,
                },
                {
                  httpOnly: true,
                  secure: true,
                }
              )

              const {
                _id,
                email,
                password,
                createdAt,
                updatedAt,
                __v,
                ...other
              } = user.toJSON()

              res.status(200).json({ user: other, expirationTime })
            }
          })
        }
      } catch (err) {
        res.status(500).json(err)
      }
    }
  }
)

router.get('/check', verify, async (req, res) => {
  const username = req.username

  try {
    const user = await User.findOne({ username })

    const { _id, email, password, createdAt, updatedAt, __v, ...other } =
      user.toJSON()

    res.status(200).json({ user: other })
  } catch (err) {
    res.status(500).json(err)
  }
})

router.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refresh_token.refreshToken

  if (!refreshToken) {
    return res.status(401).json('You are not authenticated')
  } else if (!tokens.includes(refreshToken)) {
    return res.status(500).json('Refresh token is not valid')
  } else {
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY,
      (err, user) => {
        if (err) {
          res.status(500).json(err)
        } else {
          tokens = tokens.filter((token) => token !== refreshToken)

          const newAccessToken = generateAccessToken(user.username)
          const newRefreshToken = generateRefreshToken(user.username)

          tokens.push(newRefreshToken)

          const expirationTime = jwt_decode(newAccessToken).exp

          res.cookie(
            'refresh_token',
            {
              refreshToken: newRefreshToken,
            },
            {
              path: '/auth/',
              httpOnly: true,
              secure: true,
            }
          )
          res.cookie(
            'access_token',
            {
              accessToken: newAccessToken,
            },
            {
              httpOnly: true,
              secure: true,
            }
          )

          res.status(200).json({ expirationTime })
        }
      }
    )
  }
})

router.post('/logout', verify, async (req, res) => {
  const refreshToken = req.cookies.refresh_token.refreshToken

  if (refreshToken) {
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY,
      (err, user) => {
        if (err) {
          res.status(500).json(err)
        } else {
          tokens = tokens.filter((token) => token !== refreshToken)
          res.clearCookie('refresh_token', { path: '/auth/' })
          res.clearCookie('access_token')

          res.status(200).json('Logout successfully')
        }
      }
    )
  } else {
    return res.status(401).json('You are not authenticated')
  }
})

module.exports = router
