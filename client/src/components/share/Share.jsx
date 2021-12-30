import './share.scss'
import PermMediaIcon from '@mui/icons-material/PermMedia'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import { useRef, useState } from 'react'
import { postAddCall } from '../../apiCalls/postsCalls'
import { useDispatch, useSelector } from 'react-redux'
import Picker from 'emoji-picker-react'
import CancelIcon from '@mui/icons-material/Cancel'
import { ProfilePicture } from '../profilePicture/ProfilePicture'
import CircularProgress from '@mui/material/CircularProgress'

export const Share = ({ post }) => {
  const [postDesc, setPostDesc] = useState('')

  const currentUser = useSelector((state) => state.user.userData)
  const pending = useSelector((state) => state.posts.pending)
  const dispatch = useDispatch()

  const pickerRef = useRef()

  const [file, setFile] = useState(null)

  const validatePost = () => {
    let isValid = true

    if (!postDesc.trim()) {
      isValid = false
    }

    return isValid
  }
  const handleSend = async () => {
    if (validatePost()) {
      const res = await postAddCall(postDesc, dispatch, file)
      if (res) {
        setPostDesc('')
        setFile(null)
      }
    }
  }
  const handleEmojiPickerShow = () => {
    pickerRef.current.classList.toggle('shareEmojiPickerHidden')
  }
  const handleEmojiClick = (event, emojiObject) => {
    setPostDesc((state) => {
      return state + emojiObject.emoji
    })
  }
  return (
    <div className='shareContainer'>
      <div className='shareWrapper'>
        <div className='shareTop'>
          <ProfilePicture picture={currentUser.profilePicture} size={'50px'} />
          <input
            type='text'
            className='shareTopInput'
            placeholder="What's in your mind? "
            value={postDesc}
            onChange={(e) => setPostDesc(e.target.value)}
          />
        </div>
        <hr className='shareHr' />
        {file && (
          <div className='shareImageSection'>
            <img className='shareImg' src={URL.createObjectURL(file)} alt='' />
            <CancelIcon
              className='shareCloseButton'
              onClick={() => {
                setFile(null)
              }}
            />
          </div>
        )}
        <div className='shareBottom'>
          <div className='shareBottomItems'>
            <label htmlFor='file' className='shareBottomItem'>
              <PermMediaIcon className='shareBottomItemIcon' />
              <span className='shareBottomItemText'>Photo or video</span>
              <input
                style={{ display: 'none' }}
                type='file'
                id='file'
                accept='.png,.jpg,.jpeg '
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className='shareBottomItem' onClick={handleEmojiPickerShow}>
              <EmojiEmotionsIcon className='shareBottomItemIcon' />
              <span className='shareBottomItemText'>Emoticons</span>
            </div>
          </div>
          <button className='shareBottomButton' onClick={handleSend}>
            {pending ? (
              <CircularProgress style={{ color: 'white' }} size='15px' />
            ) : (
              'Share'
            )}
          </button>
        </div>
        <div
          ref={pickerRef}
          className='shareEmojiPicker shareEmojiPickerHidden'
        >
          <Picker
            onEmojiClick={handleEmojiClick}
            pickerStyle={{ width: '100%', marginTop: '20px' }}
          />
        </div>
      </div>
    </div>
  )
}
