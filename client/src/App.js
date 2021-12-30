import './App.css'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { checkAuthStatus } from './redux/userSlice'
import { Home } from './pages/home/Home'
import { Login } from './pages/login/Login'
import { Edit } from './pages/edit/Edit'
import { Register } from './pages/register/Register'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { Profile } from './pages/profile/Profile'
import { Error } from './pages/error/Error'

const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.user.userData)
  return user ? children : <Navigate to='/login' />
}
function App() {
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.user.userData)
  const dispatch = useDispatch()

  useEffect(() => {
    const checkUser = async () => {
      try {
        await dispatch(checkAuthStatus())
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    }
    checkUser()
  }, [dispatch])

  return (
    !loading && (
      <div className='container'>
        <BrowserRouter>
          <Routes>
            <Route
              exac
              path='/'
              element={
                <PrivateRoute>
                  <Navigate to='/home' />
                </PrivateRoute>
              }
            />
            <Route
              path='/login'
              element={user ? <Navigate to='/home' /> : <Login />}
            />
            <Route
              path='/register'
              element={user ? <Navigate to='/home' /> : <Register />}
            />
            <Route
              path='/home'
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path='/profile/:username'
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path='/profile/edit'
              element={
                <PrivateRoute>
                  <Edit />
                </PrivateRoute>
              }
            />
            <Route path='*' exact={true} element={<Error />} />
          </Routes>
        </BrowserRouter>
      </div>
    )
  )
}

export default App
