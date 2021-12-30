import './navbar.scss'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HomeIcon from '@mui/icons-material/Home'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ProfilePicture } from '../profilePicture/ProfilePicture'
import { SearchBox } from '../searchBox/SearchBox'
import { logoutCall } from '../../apiCalls/authCalls'
import { isMobile } from 'react-device-detect'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

export const Navbar = () => {
  const currentUser = useSelector((state) => state.user.userData)

  const handleLogout = async () => {
    const res = await logoutCall()

    if (res.status === 200) {
      localStorage.removeItem('access_token_expiration_time')
      window.location.reload()
    }
  }

  return (
    <div className='navbarContainer'>
      <div className='navbarWrapper'>
        <div className='navbarLeft'>
          <Link
            to='/'
            style={{ textDecoration: 'none', color: 'var(--main-color)' }}
          >
            {!isMobile ? (
              <h1 className='navbarLeftTitle'>Poster</h1>
            ) : (
              <HomeIcon className='navbarIcon' style={{ fontSize: '2.1rem' }} />
            )}
          </Link>
        </div>
        <div className='navbarCenter'>
          <SearchBox />
        </div>
        <div className='navbarRight'>
          <div className='navbarRightItem'>
            <Link to={'/home'} style={{ color: 'var(--main-color)' }}>
              <HomeOutlinedIcon className='navbarIcon' />
            </Link>
          </div>
          <div className='navbarRightItem'>
            <Link to={'/profile/edit'} style={{ color: 'var(--main-color)' }}>
              <SettingsOutlinedIcon className='navbarIcon' />
            </Link>
          </div>
          <div className='navbarRightItem'>
            <Link to={`/profile/${currentUser.username}`}>
              <ProfilePicture
                picture={currentUser.profilePicture}
                size={'35px'}
              />
            </Link>
            <div className='navbarRightMenu'>
              <ExpandMoreIcon className='navbarRightMenuIcon' />
              <ul className='navbarRightMenuOptions'>
                <li className='navbarRightMenuOption' onClick={handleLogout}>
                  <ExitToAppIcon className='navbarRightMenuOptionIcon' />
                  <span>Logout</span>
                </li>
                {isMobile && (
                  <Link
                    to={'/profile/edit'}
                    style={{
                      color: 'var(--main-color)',
                      textDecoration: 'none',
                    }}
                  >
                    <li className='navbarRightMenuOption'>
                      <SettingsOutlinedIcon className='navbarRightMenuOptionIcon' />
                      <span>Edit</span>
                    </li>
                  </Link>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
