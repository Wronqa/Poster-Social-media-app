import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { editProfileCall } from '../../../apiCalls/usersCalls'
import './profileEditBox.scss'

export const ProfileEditBox = () => {
  const [city, setCity] = useState('')
  const [relationship, setRelationship] = useState(3)
  const [editStatus, setEditStatus] = useState('')

  const currentUser = useSelector((state) => state.user.userData)
  const dispatch = useDispatch()

  const relationshipRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (city.trim().length !== 0 || currentUser.relationship !== relationship) {
      if (!/\d/g.test(city)) {
        const res = await editProfileCall(
          dispatch,
          currentUser,
          city,
          relationship
        )

        res && setEditStatus('Updated successfully')
      } else
        setEditStatus(
          <span style={{ color: 'red' }}>
            City field cannot contains number
          </span>
        )
    } else {
      setEditStatus('')
    }
  }

  useEffect(() => {
    setCity('')
    setRelationship(currentUser.relationship)
  }, [currentUser])
  return (
    <div className='profileEditBoxContainer'>
      <div className='profileEditBoxWrapper'>
        <div className='profileEditBoxSubtitle'>Profile information</div>
        <form action='' className='profileEditBoxForm'>
          <div className='profileEditBoxFormItem'>
            <label
              htmlFor='profileEditBoxUsername'
              className='profileEditBoxFormItemLabel'
            >
              Username:
            </label>
            <input
              type='text'
              id='profileEditBoxUsername'
              className='profileEditBoxFormItemInput'
              placeholder={currentUser.username}
              disabled
            />
          </div>

          <div className='profileEditBoxFormItem'>
            <label
              htmlFor='profileEditBoxCity'
              className='profileEditBoxFormItemLabel'
            >
              City:
            </label>
            <input
              type='text'
              id='profileEditBoxCity'
              className='profileEditBoxFormItemInput'
              placeholder={currentUser.city}
              value={city}
              onChange={(e) => {
                setCity(e.target.value)
              }}
            />
          </div>
          <div className='profileEditBoxFormItem'>
            <label
              htmlFor='profileEditBoxUsername'
              className='profileEditBoxFormItemLabel'
            >
              Relationship:
            </label>
            <select
              id='profileEditBoxUsername'
              className='profileEditBoxFormItemSelect'
              onChange={(e) => {
                setRelationship(e.target.value)
              }}
              ref={relationshipRef}
            >
              <option value='1'>Single</option>
              <option value='2'>Taken</option>
              <option value='3'>Not set</option>
            </select>
          </div>
          <button className='profileEditBoxFormButton' onClick={handleSubmit}>
            Submit
          </button>
          <div className='profileEditBoxSuccess'>{editStatus}</div>
        </form>
      </div>
    </div>
  )
}
