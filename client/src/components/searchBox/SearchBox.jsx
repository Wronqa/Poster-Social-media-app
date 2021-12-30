import './searchBox.scss'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { useState, useEffect } from 'react'
import { Friend } from '../friend/Friend'
import { search } from '../../apiCalls/searchOptimizer'
import OutsideClickHandler from 'react-outside-click-handler'

export const SearchBox = () => {
  const [value, setValue] = useState('')
  const [searchList, setSearchList] = useState([])

  useEffect(() => {
    let isMounted = true
    const searchUser = async () => {
      try {
        const res = await search(`/user/search/${value}`)

        isMounted && setSearchList(res)
      } catch (err) {}
    }
    if (value.trim().length !== 0) searchUser()

    return () => {
      isMounted = false
    }
  }, [value])

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setValue('')
      }}
    >
      <div className='searchBoxContainer'>
        <div type='text' className='searchBoxWrapper'>
          <SearchOutlinedIcon className='searchBoxIcon' />
          <input
            type='text'
            className='searchBoxInput'
            placeholder='Search friends, posts, videos '
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {searchList !== null && searchList !== undefined && value && (
            <div className='searchBoxList'>
              {searchList.map((friend) => {
                return <Friend friend={friend} key={friend.username} />
              })}
              {searchList.length === 0 && (
                <span className='searchBoxListError'>No result</span>
              )}
            </div>
          )}
        </div>
      </div>
    </OutsideClickHandler>
  )
}
