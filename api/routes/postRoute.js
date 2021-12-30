const { body, validationResult, check } = require('express-validator')

const express = require('express')
const router = express.Router()
const uniqid = require('uniqid')

const Post = require('../models/Post')
const User = require('../models/User')

const { verify } = require('../jwtManager')

router.post(
  '/add',
  verify,
  check('desc').trim().notEmpty(),
  async (req, res) => {
    const errorList = validationResult(req)

    if (!errorList.isEmpty()) {
      res.status(403).json(errorList.errors[0])
    } else {
      const username = req.username
      try {
        const post = new Post({
          desc: req.body.desc,
          img: req.body.img ? req.body.img : null,
          username,
        })

        const savedPost = await post.save()
        const { updatedAt, __v, ...others } = savedPost.toJSON()

        res.status(200).json({ post: others })
      } catch (err) {
        res.status(500).json(err)
      }
    }
  }
)
router.get('/timeline', verify, async (req, res) => {
  const username = req.username
  try {
    const userPosts = await Post.find({ username })

    const currentUser = await User.findOne({ username })

    const friendsPosts = await Promise.all(
      currentUser.followings.map((username) => {
        return Post.find({ username })
      })
    )

    const posts = userPosts.concat(...friendsPosts)

    const filteredPosts = posts.map((post) => {
      const { __v, updatedAt, ...others } = post.toJSON()

      return others
    })

    res.status(200).json(filteredPosts)
  } catch (err) {
    res.status(500).json(err)
  }
})
router.put('/like/:id', verify, async (req, res) => {
  const username = req.username

  try {
    const post = await Post.findById(req.params.id)

    if (post.likes.includes(username)) {
      await post.updateOne({ $pull: { likes: username } })
    } else {
      await post.updateOne({ $push: { likes: username } })
    }

    res.status(200).json('Post has been liked')
  } catch (err) {
    res.status(500).json(err)
  }
})
router.put(
  '/comment/:id',
  verify,
  check('desc').trim().notEmpty(),
  async (req, res) => {
    const errorList = validationResult(req)

    if (!errorList.isEmpty()) {
      res.status(403).json(errorList.errors[0])
    } else {
      const username = req.username

      const comment = {
        id: uniqid(),
        user: username,
        desc: req.body.desc,
        date: new Date(),
      }

      try {
        const post = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $push: { comments: comment },
          },
          { new: true }
        )

        res.status(200).json(post)
      } catch (err) {
        res.status(500).json(err)
      }
    }
  }
)
router.delete('/delete/:id', verify, async (req, res) => {
  const username = req.username

  try {
    const post = await Post.findById(req.params.id)

    if (post.username === username) {
      post.deleteOne()
      res.status(200).json('Post has been deleted')
    } else {
      req.status(403).json('Unauthorized action')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})
router.get('/:username', verify, async (req, res) => {
  try {
    const userPosts = await Post.find({ username: req.params.username })

    const posts = userPosts.map((post) => {
      const { __v, updatedAt, ...others } = post.toJSON()

      return others
    })

    res.status(200).json(posts)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
