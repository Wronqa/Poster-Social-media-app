import { createSlice } from '@reduxjs/toolkit'

const sortPosts = (a, b) => {
  return new Date(b.createdAt) - new Date(a.createdAt)
}

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    postsData: [],
    error: false,
    pending: false,
  },
  reducers: {
    requestStart: (state) => {
      state.pending = true
    },
    requestSuccess: (state) => {
      state.pending = false
      state.error = false
    },
    requestError: (state) => {
      state.pending = false
      state.error = true
    },
    addPostSuccess: (state, action) => {
      state.postsData.push(action.payload)
      state.postsData.sort(sortPosts)
      state.pending = false
      state.error = false
    },
    getPostsSuccess: (state, action) => {
      state.postsData = action.payload.sort(sortPosts)
      state.pending = false
      state.error = false
    },
  },
})
export const {
  requestStart,
  requestSuccess,
  requestError,
  addPostSuccess,
  getPostsSuccess,
} = postsSlice.actions
export default postsSlice.reducer
