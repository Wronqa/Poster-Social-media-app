import './rightbar.scss'
import { Friend } from '../friend/Friend'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFriendsCall } from '../../apiCalls/usersCalls'
import { FriendsList } from '../friendsList/FriendsList'

export const Rightbar = ({ username }) => {
  const [fullListShow, setFullListShow] = useState(false)
  const [loading, setLoading] = useState(true)
  const [friends, setFriends] = useState(null)

  const currentUser = useSelector((state) => state.user.userData)
  const dispatch = useDispatch()

  useEffect(() => {
    let isMounted = true
    const fetchFriends = async () => {
      const res = await getFriendsCall(
        username ? username : currentUser.username,
        dispatch
      )
      if (res && isMounted) {
        setFriends(res)
        setLoading(false)
      }
    }
    fetchFriends()

    return () => {
      isMounted = false
    }
  }, [username, currentUser.username, dispatch])

  return (
    <div className='rightbarContainer'>
      {!loading && (
        <div className='rightbarWrapper'>
          <div className='rightbarTitle'>
            {username ? 'User friends' : 'My friends'}
          </div>
          <div className='rightbarFriendsList'>
            {friends &&
              [...friends].slice(0, 5).map((friend) => {
                return <Friend friend={friend} key={friend.username} />
              })}
          </div>
          <div className='rightbarFooter' onClick={() => setFullListShow(true)}>
            View all
          </div>
          {friends && fullListShow && (
            <FriendsList friends={friends} hideList={setFullListShow} />
          )}
        </div>
      )}
    </div>
  )
}
