const jwt = require('jsonwebtoken')

const generateAccessToken = (username) => {
  const accessToken = jwt.sign({ username }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_TIME,
  })
  return accessToken
}

const generateRefreshToken = (username) => {
  const accessToken = jwt.sign(
    { username },
    process.env.JWT_REFRESH_SECRET_KEY,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_TIME,
    }
  )
  return accessToken
}

const verify = (req, res, next) => {
  const token = req.cookies.access_token.accessToken

  if (!token) {
    return res.status(401).json('You are not authetnicated')
  } else {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) res.status(401).json('Token is not valid')
      else {
        req.username = decoded.username

        next()
      }
    })
  }
}

module.exports = { generateAccessToken, generateRefreshToken, verify }
