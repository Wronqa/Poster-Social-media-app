import './comment.scss'
import { format } from 'timeago.js'
import { useState } from 'react'
import { useEffect } from 'react'
import { getProfilePictureCall } from '../../apiCalls/usersCalls'
import { ProfilePicture } from '../profilePicture/ProfilePicture'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

export const Comment = ({ username, date, desc }) => {
  const [profilePicture, setProfilePicture] = useState('')
  const currentUser = useSelector((state) => state.user.userData)

  const dispatch = useDispatch()

  useEffect(() => {
    let isMounted = true

    const fetchProfilePicture = async () => {
      const res = await getProfilePictureCall(username, dispatch)
      res && isMounted && setProfilePicture(res)
    }
    currentUser.username === username
      ? setProfilePicture(currentUser.profilePicture)
      : fetchProfilePicture()

    return () => {
      isMounted = false
    }
  }, [currentUser.profilePicture, username, currentUser.username, dispatch])

  return (
    <div className='commentContainer'>
      <div className='commentWrapper'>
        <div className='commentLeft'>
          <Link to={`/profile/${username}`}>
            <ProfilePicture size={'35px'} picture={profilePicture} />
          </Link>
        </div>

        <div className='commentRight'>
          <div className='commentRightTop'>
            <Link
              to={`/profile/username`}
              style={{ textDecoration: 'none', color: 'black' }}
            >
              <div className='commentRightUsername'>{username}</div>
            </Link>
            <div className='commentRightDate'>{format(date)}</div>
          </div>
          <div className='commentRightBottom'>
            <div className='commentRightDesc'>{desc}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
