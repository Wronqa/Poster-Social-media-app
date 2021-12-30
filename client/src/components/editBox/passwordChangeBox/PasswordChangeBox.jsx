import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './passwordChangeBox.scss'
import { changePasswordCall } from '../../../apiCalls/usersCalls'

export const PasswordChangeBox = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPasswords, setNewPasswords] = useState({
    newPassword: '',
    confrimPassword: '',
  })
  const [operationStatus, setOperationStatus] = useState('')

  const currentUser = useSelector((state) => state.user.userData)
  const dispatch = useDispatch()

  useEffect(() => {
    let isMounted = true

    if (isMounted) {
      setCurrentPassword('')
      setNewPasswords({
        newPassword: '',
        confrimPassword: '',
      })
    }

    return () => {
      isMounted = false
    }
  }, [currentUser])

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (
      !(
        currentPassword.trim().length === 0 ||
        newPasswords.newPassword.trim().length === 0 ||
        newPasswords.confrimPassword.trim().length === 0
      )
    ) {
      if (newPasswords.newPassword !== newPasswords.confrimPassword) {
        setOperationStatus('Passwords must be the same')
      } else if (newPasswords.newPassword === currentPassword) {
        setOperationStatus('New password and current password are the same')
      } else {
        const res = await changePasswordCall(
          currentPassword,
          newPasswords,
          dispatch
        )

        if (res.status === 200) {
          setOperationStatus('')
          setCurrentPassword('')
          setNewPasswords({
            newPassword: '',
            confrimPassword: '',
          })
          setOperationStatus(
            <span style={{ color: 'green' }}> Updated successfully</span>
          )
        } else {
          setOperationStatus(res.response.data.msg)
        }
      }
    } else {
      setOperationStatus('Fields cannot be empty')
    }
  }

  return (
    <div className='passwordChangeBoxContainer'>
      <div className='passwordChangeBoxWrapper'>
        <div className='passwordChangeBoxSubtitle'>Password change</div>
        <form action='' className='passwordChangeBoxForm'>
          <div className='passwordChangeBoxFormItem'>
            <label
              htmlFor='editBoxCurrentPassword'
              className='passwordChangeBoxFormItemLabel'
            >
              Current password:
            </label>
            <input
              type='password'
              id='editBoxCurrentPassword'
              className='passwordChangeBoxFormItemInput'
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value)
              }}
            />
          </div>
          <div className='passwordChangeBoxFormItem'>
            <label
              htmlFor='editBoxNewPassword'
              className='passwordChangeBoxFormItemLabel'
            >
              New password:
            </label>
            <input
              type='password'
              id='editBoxNewPassword'
              className='passwordChangeBoxFormItemInput'
              value={newPasswords.newPassword}
              onChange={(e) => {
                setNewPasswords((state) => {
                  return {
                    ...state,
                    newPassword: e.target.value,
                  }
                })
              }}
            />
          </div>
          <div className='passwordChangeBoxFormItem'>
            <label
              htmlFor='editBoxNewPasswordConfrim'
              className='passwordChangeBoxFormItemLabel'
            >
              Confrim password:
            </label>
            <input
              type='password'
              id='editBoxNewPasswordConfrim'
              className='passwordChangeBoxFormItemInput'
              value={newPasswords.confrimPassword}
              onChange={(e) => {
                setNewPasswords((state) => {
                  return {
                    ...state,
                    confrimPassword: e.target.value,
                  }
                })
              }}
            />
          </div>
          <button
            className='passwordChangeBoxFormButton'
            onClick={handlePasswordChange}
          >
            Change
          </button>
          <div className='passwordChangeBoxFormResult'>{operationStatus}</div>
        </form>
      </div>
    </div>
  )
}
