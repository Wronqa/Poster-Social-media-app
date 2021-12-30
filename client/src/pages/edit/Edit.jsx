import './edit.scss'
import { Leftbar } from '../../components/leftbar/Leftbar'
import { Navbar } from '../../components/navbar/Navbar'

import { useSelector } from 'react-redux'

import { ProfileEditBox } from '../../components/editBox/profileEditBox/ProfileEditBox'
import { PasswordChangeBox } from '../../components/editBox/passwordChangeBox/PasswordChangeBox'

export const Edit = () => {
  const currentUser = useSelector((state) => state.user.userData)
  return (
    <div className='editContainer'>
      <div className='editWrapper'>
        <Navbar />
        <div className='editContent'>
          <div className='editContentLeft'>
            <Leftbar
              user={currentUser}
              followers={currentUser.followers.length}
            />
          </div>

          <div className='editContentRight'>
            <div className='editContentRightTitle'>Edit Profile</div>
            <div className='editContentRightItems'>
              <ProfileEditBox />
              <PasswordChangeBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
