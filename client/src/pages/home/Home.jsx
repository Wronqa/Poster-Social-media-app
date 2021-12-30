import './home.scss'
import { useSelector } from 'react-redux'
import { Navbar } from '../../components/navbar/Navbar'
import { Feed } from '../../components/feed/Feed'
import { Leftbar } from '../../components/leftbar/Leftbar'
import { Rightbar } from '../../components/rightbar/Rightbar'

export const Home = () => {
  const currentUser = useSelector((state) => state.user.userData)

  return (
    currentUser && (
      <div className='homeContainer'>
        <Navbar />
        <div className='homeContent'>
          <Leftbar user={currentUser} />
          <Feed />
          <Rightbar />
        </div>
      </div>
    )
  )
}
