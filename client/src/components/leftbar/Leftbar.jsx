import './leftbar.scss'
import { ProfilePicture } from '../profilePicture/ProfilePicture'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

export const Leftbar = ({ user, followers }) => {
  const location = useLocation()

  const [postsNumber, setPostsNumber] = useState(0)

  const posts = useSelector((state) => state.posts.postsData)
  const currentUser = useSelector((state) => state.user.userData)

  useEffect(() => {
    let isMounted = true

    if (user.username === currentUser.username) {
      let currentUserPosts = posts.filter(
        (post) => post.username === currentUser.username
      )
      isMounted && setPostsNumber(currentUserPosts.length)
    }

    return () => {
      isMounted = false
    }
  }, [posts, currentUser, user.username])

  return (
    <div className='leftbarContainer'>
      <div className='leftbarWrapper'>
        <div className='leftbarTitle'>
          {location.pathname === '/home' ? 'Your Profile' : 'User profile'}
        </div>
        <div className='leftbarTop'>
          <div className='leftbarTopUserSection'>
            <ProfilePicture picture={user.profilePicture} size={'90px'} />
            <div className='leftbarTopUserSectionUsername'>{user.username}</div>
            <div className='leftbarTopUserSectionCity'>{user.city}</div>
          </div>
        </div>
        <div className='leftbarBottom'>
          <div className='leftbarBottomItem'>
            <span className='leftbarBottomItemText'>Relationship: </span>
            <span className='leftbarBottomItemValue'>
              {(user.relationship === 1 && 'Single') ||
                (user.relationship === 2 && 'Taken') ||
                (user.relationship === 3 && 'Not set')}
            </span>
          </div>
          <div className='leftbarBottomItem'>
            <span className='leftbarBottomItemText'>Followers: </span>
            <span className='leftbarBottomItemValue'>
              {location.pathname !== '/home'
                ? followers
                : user.followers.length}
            </span>
          </div>
          <div className='leftbarBottomItem'>
            <span className='leftbarBottomItemText'>Followings: </span>
            <span className='leftbarBottomItemValue'>
              {user.followings.length}
            </span>
          </div>

          {user.username === currentUser.username && (
            <div className='leftbarBottomItem'>
              <span className='leftbarBottomItemText'>Posts: </span>
              <span className='leftbarBottomItemValue'>{postsNumber}</span>
            </div>
          )}

          {location.pathname === '/home' && (
            <Link to={`/profile/${user.username}`}>
              <button className='leftBarBottomButton'>Show profile</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
