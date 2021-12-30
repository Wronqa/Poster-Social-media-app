const express = require('express')
const helmet = require('helmet')
const dotenv = require('dotenv')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

const { verify } = require('./jwtManager')

const authRoute = require('./routes/authRoute')
const postRoute = require('./routes/postRoute')
const userRoute = require('.//routes/userRoute')

const app = express()
dotenv.config()

app.use(express.json())
app.use(helmet())
app.use(morgan('common'))
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/user', userRoute)

mongoose.connect(process.env.DATABASE_URL, () => {
  console.log('Connected to database')
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    public_id: (req, file) => file.originalname,
    folder: (req) => req.body.folder,
  },
})

const upload = multer({ storage: storage })

app.post(
  '/api/upload',
  verify,
  upload.single('image'),

  async (req, res) => {
    return res.status(200).json({ image: req.file.path })
  }
)

app.listen(5000, () => {
  console.log('Server started')
})
