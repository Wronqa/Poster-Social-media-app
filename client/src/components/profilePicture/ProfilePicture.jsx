import './profilePicture.scss'

export const ProfilePicture = ({ picture, size }) => {
  return (
    <div className='profilePictureContainer'>
      {picture && (
        <img
          src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload/v1639232389/data/profiles/${picture}.png`}
          alt=''
          style={{ width: `${size}`, height: `${size}` }}
          className='profilePictureImg'
        />
      )}
    </div>
  )
}
