import './profile.scss'
import { Rightbar } from '../../components/rightbar/Rightbar'
import { Feed } from '../../components/feed/Feed'
import { Leftbar } from '../../components/leftbar/Leftbar'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { Navbar } from '../../components/navbar/Navbar'
import { useState, useEffect } from 'react'
import { getUserCall } from '../../apiCalls/usersCalls'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { followActionCall } from '../../apiCalls/usersCalls'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import { isMobile } from 'react-device-detect'
import { useLocation } from 'react-router-dom'
import { ProfilePicture } from '../../components/profilePicture/ProfilePicture'
import { changeProfilePictureCall } from '../../apiCalls/usersCalls'
import { CoverPhoto } from '../../components/coverPhoto/CoverPhoto'
import CircularProgress from '@mui/material/CircularProgress'

export const Profile = () => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [followStatus, setFollowStatus] = useState(null)
  const [followersNumber, setFollowersNumber] = useState()

  const pending = useSelector((state) => state.user.pending)
  const currentUser = useSelector((state) => state.user.userData)
  const username = useParams().username
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    let isMounted = true

    const getUser = async () => {
      const res = await getUserCall(username, dispatch)

      if (isMounted) {
        res && setUser(res)
        setLoading(false)
      }
    }

    if (username === currentUser.username && isMounted) {
      setUser(currentUser)
      setLoading(false)
    } else getUser()

    return () => {
      isMounted = false
    }
  }, [
    location.pathname,
    currentUser.username,
    currentUser.profilePicture,
    currentUser.coverPicture,
    dispatch,
  ])

  useEffect(() => {
    let isMounted = true

    if (user) {
      if (currentUser.followings.includes(user.username)) {
        isMounted && setFollowStatus(true)
      } else {
        isMounted && setFollowStatus(false)
      }
      isMounted && setFollowersNumber(user.followers.length)
    }
    return () => {
      isMounted = false
    }
  }, [user, currentUser.followings])

  const handleFollow = async () => {
    const res = await followActionCall(username, dispatch, currentUser)
    if (res) {
      setFollowersNumber(
        followStatus ? followersNumber - 1 : followersNumber + 1
      )
      setFollowStatus(!followStatus)
    }
  }

  const handleChangePhoto = async (picture) => {
    changeProfilePictureCall(picture, dispatch)
  }

  return (
    <div className='profileContainer'>
      <div className='profileWrapper'>
        <Navbar />
        {!loading && user && (
          <>
            <div className='profileTop'>
              <CoverPhoto
                picture={user.coverPicture}
                username={user.username}
              />
              <div
                className='profileTopPictureSection'
                style={{
                  position: 'absolute',
                  left: !isMobile ? '100px' : '0px',
                  bottom: '-100px',
                  right: '0',
                  margin: isMobile && 'auto',
                  width: `200px`,
                  height: `200px`, ///Chyba mozesz przeniesc do stylwe
                }}
              >
                <ProfilePicture size={'200px'} picture={user.profilePicture} />
                {user.username === currentUser.username && (
                  <label
                    htmlFor='profilePictureFile'
                    className='profileTopChangePhotoSection'
                  >
                    {pending ? (
                      <CircularProgress
                        style={{ color: 'crimson' }}
                        size='35px'
                      />
                    ) : (
                      <AddAPhotoIcon className='profileTopChangePhotoSectionButton' />
                    )}
                    <input
                      style={{ display: 'none' }}
                      type='file'
                      id='profilePictureFile'
                      accept='.png,.jpg,.jpeg '
                      onChange={(e) => handleChangePhoto(e.target.files[0])}
                    />
                  </label>
                )}
              </div>

              <div className='profileTopUserInfo'>
                <div className='profileTopUsername'>{user.username}</div>
                <div className='profileTopCity'>{user.city}</div>
              </div>
              <div className='profileTopUserFriendsInfo'>
                {!(currentUser.username === user.username) && (
                  <div
                    className='profileTopUserFriendsInfoItem'
                    style={{
                      position: isMobile && 'absolute',
                      right: '0',
                      bottom: '90px',
                    }}
                  >
                    {followStatus !== null &&
                      (followStatus ? (
                        <button
                          className='profileTopFollowUser'
                          onClick={handleFollow}
                        >
                          <span className='profileTopFollowUserText'>
                            Unfollow
                          </span>
                          <RemoveIcon className='profileTopFollowUserIcon' />
                        </button>
                      ) : (
                        <button
                          className='profileTopFollowUser'
                          onClick={handleFollow}
                        >
                          <span className='profileTopFollowUserText'>
                            Follow
                          </span>
                          <AddIcon className='profileTopFollowUserIcon' />
                        </button>
                      ))}
                  </div>
                )}

                <div className='profileTopUserFriendsInfoItem'>
                  <div className='profileTopUserFriendsInfoItemText'>
                    Followers
                  </div>
                  <div className='profileTopUserFriendsInfoItemValue'>
                    {followersNumber}
                  </div>
                </div>
                {isMobile && (
                  <div className='profileTopUserFriendsInfoItem'>
                    <div className='profileTopUserFriendsInfoItemText'>
                      Relationship
                    </div>
                    <div className='profileTopUserFriendsInfoItemValue'>
                      {(user.relationship === 1 && 'Single') ||
                        (user.relationship === 2 && 'Taken') ||
                        (user.relationship === 3 && 'Not set')}
                    </div>
                  </div>
                )}
                <div className='profileTopUserFriendsInfoItem'>
                  <div className='profileTopUserFriendsInfoItemText'>
                    Followings
                  </div>
                  <div className='profileTopUserFriendsInfoItemValue'>
                    {user.followings.length}
                  </div>
                </div>
              </div>
            </div>
            <div
              className='profileBottom'
              style={{ marginTop: isMobile && '220px' }}
            >
              <Leftbar user={user} followers={followersNumber} />
              <Feed user={user} />
              <Rightbar username={username} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
