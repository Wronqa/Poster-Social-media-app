import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import postsReducer from './postsSlice'

const reducer = combineReducers({
  user: userReducer,
  posts: postsReducer,
})

const store = configureStore({ reducer })

export default store
