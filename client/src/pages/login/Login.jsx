import './login.scss'
import { useState } from 'react'
import { loginCall } from '../../apiCalls/authCalls'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'

export const Login = () => {
  const [credentials, setCredentials] = useState({
    fields: {
      email: '',
      password: '',
    },
    error: '',
  })

  const dispatch = useDispatch()

  const pending = useSelector((state) => state.user.pending)

  const validateUser = () => {
    const fields = credentials.fields
    let error
    let isValid = true

    if (!fields.email.trim()) {
      error = 'Email field cannot be empty'
    } else if (!fields.password.trim()) {
      error = 'Password field cannot be empty'
    } else if (
      //eslint-disable-next-line
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(fields.email)
    ) {
      error = 'Invalid email adress'
    } else if (fields.password.trim().length < 8) {
      error = 'Password must be at least 8 characters'
    }

    if (error) {
      isValid = false
      setCredentials((state) => {
        return {
          ...state,
          error,
        }
      })
    }

    return isValid
  }

  const handleChange = (field, e) => {
    let fields = credentials.fields
    fields[field] = e.target.value
    setCredentials((state) => {
      return {
        ...state,
        fields,
      }
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (validateUser()) {
      const res = await loginCall(credentials, dispatch)

      res &&
        setCredentials((state) => {
          return {
            ...state,
            error: res,
          }
        })
    }
  }

  return (
    <>
      <div className='loginContainer'>
        <div className='loginWrapper'>
          <div className='loginLogo'>Poster</div>
          <Link to='/register'>
            <div className='loginRegisterLink'>Sign in</div>
          </Link>
          <div className='loginBox'>
            <form action='' className='loginBoxForm' onSubmit={handleLogin}>
              <div className='loginBoxFormInfoSection'>
                <h2 className='loginBoxFormTitle'>Login in now</h2>
                <h4 className='loginBoxFormSubtitle'>
                  Please type your email and password
                </h4>
              </div>
              <div className='loginBoxFormItem'>
                <label htmlFor='email' className='loginBoxFormLabel'>
                  Email:
                </label>
                <input
                  className='loginBoxFormInput'
                  id='email'
                  type='text'
                  placeholder='email'
                  value={credentials.fields.email}
                  onChange={handleChange.bind(this, 'email')}
                />
              </div>
              <div className='loginBoxFormItem'>
                <label htmlFor='password' className='loginBoxFormLabel'>
                  Password:
                </label>
                <input
                  className='loginBoxFormInput'
                  id='password'
                  type='password'
                  placeholder='password'
                  value={credentials.fields.password}
                  onChange={handleChange.bind(this, 'password')}
                />
              </div>
              <button className='loginBoxFormButton'>
                {pending ? (
                  <CircularProgress style={{ color: 'white' }} size='25px' />
                ) : (
                  'Login'
                )}
              </button>
            </form>
          </div>
          <div className='loginBoxError'>{credentials.error}</div>
        </div>
      </div>
    </>
  )
}
