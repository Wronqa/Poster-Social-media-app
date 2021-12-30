import './friend.scss'
import { ProfilePicture } from '../profilePicture/ProfilePicture'
import { Link } from 'react-router-dom'
import { isMobile } from 'react-device-detect'

export const Friend = ({ friend }) => {
  return (
    <div className='friendContainer'>
      <Link
        to={`/profile/${friend.username}`}
        style={{ textDecoration: 'none', color: 'black' }}
      >
        <div className='friendWrapper'>
          <ProfilePicture
            picture={friend.profilePicture}
            size={!isMobile ? '50px' : '40px'}
          />

          <div className='friendInformation'>
            <span className='friendUsername'>{friend.username}</span>
            <span className='friendCity'>{friend.city}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
