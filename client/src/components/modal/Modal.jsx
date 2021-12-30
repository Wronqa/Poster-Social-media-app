import './modal.scss'

export const Modal = ({ setModalShow, deletePost, id }) => {
  return (
    <div className='modalContainer'>
      <div className='modalWrapper'>
        <div className='modalBox'>
          <div className='modalBoxTop'>
            <span className='modalBoxTopText'>
              Are you sure you want to delete this posts?
            </span>
          </div>
          <div className='modalBoxBottom'>
            <button
              className='modalBoxBottomButton'
              onClick={() => deletePost(id)}
            >
              Yes
            </button>
            <button
              className='modalBoxBottomButton'
              onClick={() => setModalShow(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
