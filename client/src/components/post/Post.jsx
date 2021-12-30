import './post.scss'
import { format } from 'timeago.js'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect, useRef } from 'react'
import { Comment } from '../comment/Comment'
import { CommentShare } from '../commentShare/commentShare'
import ClearIcon from '@mui/icons-material/Clear'
import { Modal } from '../modal/Modal'
import { likePostCall } from '../../apiCalls/postsCalls'
import { Link } from 'react-router-dom'
import { getProfilePictureCall } from '../../apiCalls/usersCalls'
import { ProfilePicture } from '../profilePicture/ProfilePicture'

export const Post = ({ post, deletePost }) => {
  const [loading, setLoading] = useState(true)

  const currentUser = useSelector((state) => state.user.userData)

  const dispatch = useDispatch()

  const [likes, setLikes] = useState()
  const [isLiked, setIsLiked] = useState(false)
  const [userPicture, setUserPicture] = useState('')

  const [comments, setComments] = useState()

  const [deleteModalShow, setModalShow] = useState(false)

  const commentsRef = useRef()

  useEffect(() => {
    let isMounted = true
    const preparePost = async () => {
      try {
        if (post.username === currentUser.username)
          isMounted && setUserPicture(currentUser.profilePicture)
        else {
          const res = await getProfilePictureCall(post.username, dispatch)
          res && isMounted && setUserPicture(res)
        }

        isMounted && setComments([...post.comments].sort(sortComments))
        isMounted && setLikes(post.likes.length)
        if (post.likes.includes(currentUser.username)) {
          isMounted && setIsLiked(true)
        } else {
          isMounted && setIsLiked(false)
        }

        isMounted && setLoading(false)
      } catch (err) {}
    }
    preparePost()

    return () => {
      isMounted = false
    }
  }, [
    post._id,
    currentUser.profilePicture,
    post,
    currentUser.username,
    dispatch,
  ])

  const sortComments = (a, b) => {
    return new Date(b.date) - new Date(a.date)
  }
  const handleShowComments = () => {
    commentsRef.current.classList.toggle('hidden')
  }
  const handleLike = async () => {
    const res = await likePostCall(dispatch, post)
    if (res) {
      setLikes(isLiked ? likes - 1 : likes + 1)
      setIsLiked(!isLiked)
    }
  }

  return (
    <div className='postContainer'>
      <div className='postWrapper'>
        <div className='postTop'>
          <Link to={`/profile/${post.username}`}>
            <ProfilePicture picture={userPicture} size={'45px'} />
          </Link>
          {!loading && (
            <div className='postTopInfo'>
              <div className='postTopInfoLeft'>
                <Link
                  to={`/profile/${post.username}`}
                  style={{ textDecoration: 'none', color: 'black' }}
                >
                  <span className='postTopInfoLeftUsername'>
                    {post.username}
                  </span>
                </Link>
                <span className='postTopInfoLeftTime'>
                  {format(post.createdAt)}
                </span>
              </div>
              <div className='postTopInfoRight'>
                {currentUser.username === post.username && (
                  <ClearIcon
                    className='postTopInfoRightDeleteButton'
                    onClick={() => setModalShow(true)}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        <div className='postCenter'>{post.desc}</div>
        {post.img && (
          <img
            src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload/v1639165980/data/posts/${post.img}.png`}
            alt=''
            className='postImage'
          />
        )}

        <div className='postBottom'>
          <div className='postBottomLeft'>
            {isLiked ? (
              <FavoriteIcon onClick={handleLike} />
            ) : (
              <FavoriteBorderIcon onClick={handleLike} />
            )}
            <span className='postBottomLeftLikes'>{likes}</span>
          </div>
          <div className='postBottomRight ' onClick={handleShowComments}>
            Comments ({comments ? comments.length : 0})
          </div>
        </div>

        <div ref={commentsRef} className='postBottomCommentsSection hidden'>
          <CommentShare
            post={post}
            setComments={setComments}
            sortComments={sortComments}
          />
          <hr className='postBottomCommentsSectionHr' />
          {comments &&
            comments.map((comment) => (
              <Comment
                username={comment.user}
                desc={comment.desc}
                date={comment.date}
                key={comment.id}
              />
            ))}
        </div>
      </div>
      {deleteModalShow && (
        <Modal
          setModalShow={setModalShow}
          deletePost={deletePost}
          id={post._id}
        />
      )}
    </div>
  )
}
