import './feed.scss'
import { Post } from '../post/Post'
import { Share } from '../share/Share'
import { useState, useEffect } from 'react'
import { getPostsCall } from '../../apiCalls/postsCalls'
import { useDispatch, useSelector } from 'react-redux'
import { deletePostCall } from '../../apiCalls/postsCalls'

export const Feed = ({ user }) => {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  const posts = useSelector((state) => state.posts.postsData)
  const currentUser = useSelector((state) => state.user.userData)

  useEffect(() => {
    let isMounted = true
    const loadPosts = async () => {
      await getPostsCall(dispatch, user && user.username)
      isMounted && setLoading(false)
    }

    loadPosts()

    return () => {
      isMounted = false
    }
  }, [user, dispatch])

  const deletePost = (id) => {
    const tempPosts = [...posts]
    deletePostCall(dispatch, id, { tempPosts })
  }

  return (
    <div className='feedContainer'>
      <div className='feedWrapper'>
        {!user && <h1 className='feedTitle'>News</h1>}

        {user ? user.username === currentUser.username && <Share /> : <Share />}

        {!loading && (
          <div className='feedPosts'>
            {posts &&
              posts.map((post) => {
                return (
                  <Post post={post} key={post._id} deletePost={deletePost} />
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}
