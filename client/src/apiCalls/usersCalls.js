import {
  requestStart,
  requestError,
  requestSuccess,
  updateSuccess,
} from '../redux/userSlice'

import { axiosJWT } from '../axiosJWT'

const getUserCall = async (username, dispatch) => {
  dispatch(requestStart())
  try {
    const res = await axiosJWT().get(`/user/${username}`)
    dispatch(requestSuccess())

    return res.data
  } catch (err) {
    dispatch(requestError())
  }
}
const followActionCall = async (username, dispatch, currentUser) => {
  dispatch(requestStart())
  try {
    const res = await axiosJWT().put(`/user/${username}/follow`)
    const user = { ...currentUser }

    if (user.followings.includes(username)) {
      user.followings = user.followings.filter((user) => user !== username)
    } else {
      user.followings = [...user.followings, username]
    }

    dispatch(updateSuccess(user))

    return res
  } catch (err) {
    dispatch(requestError())
  }
}
const editProfileCall = async (dispatch, user, city, relationship) => {
  dispatch(requestStart())
  try {
    const res = await axiosJWT().put('/user/edit', {
      city: city.trim().length === 0 ? user.city : city,
      relationship,
    })
    dispatch(updateSuccess(res.data))
    return res
  } catch (err) {
    dispatch(requestError())
  }
}
const getFriendsCall = async (username, dispatch) => {
  dispatch(requestStart())
  try {
    const res = await axiosJWT().get(`/user/${username}/friends`)

    dispatch(requestSuccess())
    return res.data
  } catch (err) {
    dispatch(requestError())
  }
}
const getProfilePictureCall = async (username, dispatch) => {
  dispatch(requestStart())
  try {
    const res = await axiosJWT().get(`/user/${username}/picture`)
    dispatch(requestSuccess())
    return res.data
  } catch (err) {
    dispatch(requestError())
  }
}
const changeProfilePictureCall = async (picture, dispatch) => {
  dispatch(requestStart())
  try {
    let data = new FormData()
    const fileName = Date.now() + picture.name
    data.append('folder', 'data/profiles')
    data.append('image', picture, fileName)

    const uploadRes = await axiosJWT().post('/upload', data)
    if (uploadRes) {
      const changeRes = await axiosJWT().put('/user/avatar', {
        picture: fileName,
      })
      dispatch(updateSuccess(changeRes.data))
    }
  } catch (err) {
    dispatch(requestError())
  }
}
const changeCoverPhotoCall = async (picture, dispatch) => {
  dispatch(requestStart())
  try {
    let data = new FormData()
    const fileName = Date.now() + picture.name
    data.append('folder', 'data/profiles')
    data.append('image', picture, fileName)

    const uploadRes = await axiosJWT().post('/upload', data)
    if (uploadRes) {
      const changeRes = await axiosJWT().put('/user/background', {
        picture: fileName,
      })
      dispatch(updateSuccess(changeRes.data))
    }
  } catch (err) {
    dispatch(requestError())
  }
}
const changePasswordCall = async (currentPassword, newPasswords, dispatch) => {
  dispatch(requestStart())
  try {
    const res = await axiosJWT().put('/user/password', {
      password: currentPassword,
      newPassword: newPasswords.newPassword,
      confrimPasword: newPasswords.confrimPassword,
    })
    dispatch(requestSuccess())
    return res
  } catch (err) {
    dispatch(requestError())
    return err
  }
}

export {
  getUserCall,
  followActionCall,
  editProfileCall,
  getFriendsCall,
  getProfilePictureCall,
  changeProfilePictureCall,
  changeCoverPhotoCall,
  changePasswordCall,
}
