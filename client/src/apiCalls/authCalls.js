import axios from 'axios'
import {
  requestStart,
  requestError,
  requestSuccess,
  updateSuccess,
} from '../redux/userSlice'

import { axiosJWT } from '../axiosJWT'

const registerCall = async (dispatch, credentials) => {
  dispatch(requestStart())

  try {
    await axios.post('/auth/register', {
      ...credentials.fields,
    })
    dispatch(requestSuccess())
  } catch (err) {
    dispatch(requestError())
    if (err.response.data.msg) return err.response.data.msg
    else return 'Connection error'
  }
}
const loginCall = async (credentials, dispatch) => {
  dispatch(requestStart())
  try {
    const res = await axios.post('/auth/login', { ...credentials.fields })
    localStorage.setItem(
      'access_token_expiration_time',
      res.data.expirationTime
    )
    dispatch(updateSuccess(res.data.user))
  } catch (err) {
    dispatch(requestError())

    if (err.response.data.msg) return err.response.data.msg
    else return 'Connection error'
  }
}
const logoutCall = async () => {
  try {
    const res = axiosJWT().post('/auth/logout')
    return res
  } catch (err) {
    return err
  }
}

export { registerCall, loginCall, logoutCall }
