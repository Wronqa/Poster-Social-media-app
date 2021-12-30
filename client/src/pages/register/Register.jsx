import React from 'react'
import './register.scss'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { registerCall } from '../../apiCalls/authCalls'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'

export const Register = () => {
  const [credentials, setCredentials] = useState({
    fields: {
      email: '',
      username: '',
      city: '',
      password: '',
      passwordConfirmation: '',
    },
    error: '',
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const pending = useSelector((state) => state.user.pending)

  const validateUser = () => {
    const fields = credentials.fields
    let error
    let isValid = true

    if (
      !fields.username.trim() ||
      !fields.city.trim() ||
      !fields.email.trim() ||
      !fields.password.trim() ||
      !fields.passwordConfirmation.trim()
    ) {
      error = 'Fields cannot be empty'
    } else if (
      //eslint-disable-next-line
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(fields.email)
    ) {
      error = 'Invalid email adress'
    } else if (fields.password.trim().length < 8) {
      error = 'Password must be at least 8 characters'
    } else if (fields.password !== fields.passwordConfirmation) {
      error = 'Passwords must be the same'
    } else if (fields.username.length < 5) {
      error = 'Username must be at least 5 characters'
    } else if (fields.username.length > 10) {
      error = 'Username must be max 10 characters'
    } else if (/\d/.test(fields.city)) {
      error = 'City field cannot contains number'
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateUser()) {
      const res = await registerCall(dispatch, { ...credentials })

      if (res) {
        setCredentials((state) => {
          return {
            ...state,
            error: res,
          }
        })
      } else navigate('/login')
    }
  }

  return (
    <>
      <div className='registerContainer'>
        <div className='registerWrapper'>
          <div className='registerLogo'>Poster</div>
          <Link to='/login'>
            <div className='registerLoginLink'>Login</div>
          </Link>
          <div className='registerBox'>
            <form action='' className='registerBoxForm' onSubmit={handleSubmit}>
              <div className='registerBoxFormInfoSection'>
                <h2 className='registerBoxFormTitle'>Sign up now</h2>
                <h4 className='registerBoxFormSubtitle'>
                  Please enter your profile data below
                </h4>
              </div>
              <div className='registerBoxFormHoriontalItems'>
                <div className='registerBoxFormItem'>
                  <label htmlFor='username' className='registerBoxFormLabel'>
                    Username:
                  </label>
                  <input
                    className='registerBoxFormInput'
                    id='username'
                    type='text'
                    placeholder='username'
                    value={credentials.fields.username}
                    onChange={handleChange.bind(this, 'username')}
                  />
                </div>
                <div className='registerBoxFormItem'>
                  <label htmlFor='city' className='registerBoxFormLabel'>
                    City:
                  </label>
                  <input
                    className='registerBoxFormInput'
                    id='city'
                    type='text'
                    placeholder='city'
                    value={credentials.fields.city}
                    onChange={handleChange.bind(this, 'city')}
                  />
                </div>
              </div>

              <div className='registerBoxFormItem'>
                <label htmlFor='email' className='registerBoxFormLabel'>
                  Email:
                </label>
                <input
                  className='registerBoxFormInput'
                  id='email'
                  type='text'
                  placeholder='email'
                  value={credentials.fields.email}
                  onChange={handleChange.bind(this, 'email')}
                />
              </div>

              <div className='registerBoxFormHoriontalItems'>
                <div className='registerBoxFormItem'>
                  <label htmlFor='password' className='registerBoxFormLabel'>
                    Password:
                  </label>
                  <input
                    className='registerBoxFormInput'
                    id='password'
                    type='password'
                    placeholder='password'
                    value={credentials.fields.password}
                    onChange={handleChange.bind(this, 'password')}
                  />
                </div>
                <div className='registerBoxFormItem'>
                  <label
                    htmlFor='passwordConfirmation'
                    className='registerBoxFormLabel'
                  >
                    Confrim password:
                  </label>
                  <input
                    className='registerBoxFormInput'
                    id='passwordConfirmation'
                    type='password'
                    placeholder='Confrim password'
                    value={credentials.fields.passwordConfirmation}
                    onChange={handleChange.bind(this, 'passwordConfirmation')}
                  />
                </div>
              </div>

              <button className='registerBoxFormButton'>
                {pending ? (
                  <CircularProgress style={{ color: 'white' }} size='25px' />
                ) : (
                  'REGISTER'
                )}
              </button>
            </form>
          </div>

          <div className='loginBoxError'>{!pending && credentials.error}</div>
        </div>
      </div>
    </>
  )
}
