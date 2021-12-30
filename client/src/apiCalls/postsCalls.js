import {
  requestStart,
  requestSuccess,
  addPostSuccess,
  getPostsSuccess,
  requestError,
} from '../redux/postsSlice'

import { axiosJWT } from '../axiosJWT'

const postAddCall = async (postDesc, dispatch, file) => {
  dispatch(requestStart())

  let data = new FormData()
  let fileName
  let uploadRes

  try {
    if (file) {
      fileName = Date.now() + file.name

      data.append('folder', 'data/posts')
      data.append('image', file, fileName)

      uploadRes = await axiosJWT().post('/upload', data)
    }
    if ((file && uploadRes) || !file) {
      const res = await axiosJWT().post('/posts/add', {
        desc: postDesc,
        img: file ? fileName : null,
      })
      dispatch(addPostSuccess(res.data.post))
      return res
    }
  } catch (err) {
    dispatch(requestError())
  }
}
const getPostsCall = async (dispatch, username) => {
  dispatch(requestStart())
  try {
    const posts = !username
      ? await axiosJWT().get('/posts/timeline')
      : await axiosJWT().get(`/posts/${username}`)

    dispatch(getPostsSuccess(posts.data))
  } catch (err) {
    dispatch(requestError)
  }
}

const deletePostCall = async (dispatch, id, { tempPosts: posts }) => {
  dispatch(requestStart())
  try {
    const res = await axiosJWT().delete(`/posts/delete/${id}`)

    if (res) {
      const index = posts.findIndex((post) => post._id === id)
      posts.splice(index, 1)

      dispatch(getPostsSuccess(posts))
    }
  } catch (err) {
    dispatch(requestError())
  }
}
const commentPostCall = async (dispatch, post, commentDesc) => {
  dispatch(requestStart())
  try {
    const res = await axiosJWT().put(`/posts/comment/${post._id}`, {
      desc: commentDesc,
    })
    dispatch(requestSuccess())

    return res.data
  } catch (err) {
    dispatch(requestError)
  }
}
const likePostCall = async (dispatch, post) => {
  dispatch(requestStart())
  try {
    const res = await axiosJWT().put(`/posts/like/${post._id}`)

    dispatch(requestSuccess())
    return res.data
  } catch (err) {
    dispatch(requestError)
  }
}
export {
  postAddCall,
  getPostsCall,
  deletePostCall,
  commentPostCall,
  likePostCall,
}
