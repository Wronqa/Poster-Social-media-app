import './friendsList.scss'
import { Friend } from '../friend/Friend'
import CloseIcon from '@mui/icons-material/Close'

export const FriendsList = ({ friends, hideList }) => {
  return (
    <div className='friendsListContainer'>
      <div className='friendsListWrapper'>
        <div className='friendsListBox'>
          <div className='friendsListBoxTop'>
            <h1 className='friendsListBoxTopTitle'>Friends</h1>
            <CloseIcon
              className='friendsListBoxTopIcon'
              onClick={() => hideList(false)}
            />
          </div>
          <hr className='friendsListBoxHr' />
          <div className='friendsListBoxBottom'>
            {friends &&
              friends.map((friend) => {
                return <Friend friend={friend} key={friend.username} />
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
