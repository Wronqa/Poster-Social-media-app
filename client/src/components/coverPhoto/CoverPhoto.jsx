import './coverPhoto.scss'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import { changeCoverPhotoCall } from '../../apiCalls/usersCalls'
import { useSelector, useDispatch } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'

export const CoverPhoto = ({ picture, username }) => {
  const currentUser = useSelector((state) => state.user.userData)
  const pending = useSelector((state) => state.user.pending)

  const dispatch = useDispatch()

  const handleChangeCoverPhoto = (picture) => {
    changeCoverPhotoCall(picture, dispatch)
  }
  return (
    <div className='coverPhotoContainer'>
      <div className='coverPhotoWrapper'>
        {picture && (
          <img
            src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload/v1639232389/data/profiles/${picture}.png`}
            alt=''
            className='coverPhotoImg'
          />
        )}
        {username === currentUser.username && (
          <label htmlFor='coverPhotoFile' className='coverPhotoChange'>
            {pending ? (
              <CircularProgress style={{ color: 'crimson' }} size='20px' />
            ) : (
              <AddAPhotoIcon className='coverPhotoChangeIcon' />
            )}
            <input
              style={{ display: 'none' }}
              type='file'
              id='coverPhotoFile'
              accept='.png,.jpg,.jpeg '
              onChange={(e) => handleChangeCoverPhoto(e.target.files[0])}
            />
          </label>
        )}
      </div>
    </div>
  )
}
