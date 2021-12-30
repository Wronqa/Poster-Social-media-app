import './commentShare.scss'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import SendIcon from '@mui/icons-material/Send'
import { commentPostCall } from '../../apiCalls/postsCalls'
import { useSelector } from 'react-redux'
import { ProfilePicture } from '../profilePicture/ProfilePicture'

export const CommentShare = ({ post, setComments, sortComments }) => {
  const [commentDesc, setCommentDesc] = useState('')
  const dispatch = useDispatch()

  const currentUser = useSelector((state) => state.user.userData)

  const validateComment = () => {
    let isValid = true

    if (!commentDesc.trim()) {
      isValid = false
    }

    return isValid
  }
  const handleSend = async () => {
    if (validateComment()) {
      const res = await commentPostCall(dispatch, post, commentDesc)

      if (res) {
        setComments([...res.comments].sort(sortComments))
        setCommentDesc('')
      }
    }
  }
  return (
    <div className='shareCommentContainer'>
      <div className='shareCommentWrapper'>
        <ProfilePicture size='38px' picture={currentUser.profilePicture} />
        <input
          type='text'
          className='shareCommentInput'
          placeholder='Comment post '
          value={commentDesc}
          onChange={(e) => setCommentDesc(e.target.value)}
        />

        <SendIcon className='shareCommentSendButton' onClick={handleSend} />
      </div>
    </div>
  )
}
