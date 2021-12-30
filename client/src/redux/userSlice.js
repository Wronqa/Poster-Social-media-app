import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { axiosJWT } from '../axiosJWT'

export const checkAuthStatus = createAsyncThunk('/auth/check', async (user) => {
  try {
    const res = await axiosJWT().get('/auth/check', { withCredentials: true })
    return res.data.user
  } catch (err) {
    return null
  }
})

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    error: false,
    pending: false,
  },
  reducers: {
    requestStart: (state) => {
      state.pending = true
    },
    requestError: (state) => {
      state.pending = false
      state.error = true
    },
    requestSuccess: (state) => {
      state.pending = false
      state.error = false
    },
    updateSuccess: (state, action) => {
      state.userData = action.payload
      state.pending = false
      state.error = false
    },
  },
  extraReducers: {
    [checkAuthStatus.pending]: (state) => {
      state.pending = true
      state.error = false
    },
    [checkAuthStatus.fulfilled]: (state, action) => {
      state.pending = false
      state.userData = action.payload
    },
    [checkAuthStatus.rejected]: (state, action) => {
      state.pending = false
      state.userData = null
      state.error = action.payload
    },
  },
})
export const { requestStart, requestError, requestSuccess, updateSuccess } =
  userSlice.actions
export default userSlice.reducer
