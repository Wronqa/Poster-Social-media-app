# Poster - Social media app

Poster is a fully functional social media aplication.



## Table of Contents  
[Features](#Features)   
[Technologies](#Technologies)   
[Installation](#Installation)  
[Screenshots](#Screenshots)  


## Features 
 - Sharing posts (with emoticons also)
 - Sharing photos
 - Commenting posts
 - Liking posts
 - Realtime searching for users
 - Deleting posts
 - Following/Unfollowing users
 - Viewing timeline posts
 - Profile pages
   - Changing profile picture
   - Changing cover photo
   - Editing personal information (city, relatioship status)
   - Changing password
- Followings list
   - View all followings
- Responsive layout



The application uses JWT authentication system (access token and refresh token). Tokens are stored in HttpOnly secure cookies.   



## Technologies

- Frontend

   - HTML, SASS, Java Script 
   - React.js (Hooks) + Redux Toolkit
   - MUI
   
   
   
    NPM's
    - Axios 0.24.0
    - Dotenv 10.0.0
    - emoji-picker-react 3.4.8
    - react-cookie 4.1.1
    - react-device-detect 2.1.2
    - react-redux 7.2.6
    - react-router-dom 6.0.2
    - sass 1.43.4
    - timeago.js 4.0.2
    - redux 4.1.2
  
- Backend
   - Node.js + Express.js
   - MongoDB
   - JWT
   - Cloudinary API

    NPM's
    - bcrypt 5.0.1
    - cloudinary 1.27.1
    - cookie-parser 1.4.6
    - dotenv 10.0.0
    - express 4.17.1
    - express-validator 6.13.0
    - helmet 4.6.0
    - jsonwebtoken 8.5.1
    - jwt-decode 3.1.2
    - mongoose 6.0.12
    - morgan 1.10.0
    - multer 1.4.4
    - multer-storage-cloudinary 4.0.0
    - uniqid 5.4.0

 ## Installation
 
 #### 1. Install [Node.js](https://nodejs.org/en/) and [GIT](https://git-scm.com/) 
 #### 2. Clone the repo
 #### 3. Create **.env** file in api and client directory and fill it based on the following examples
 
 Client
  ```bash
REACT_APP_CLOUDINARY_NAME = 
```

Api 
  ```bash
DATABASE_URL = 

SALT_ROUNDS = 

JWT_SECRET_KEY = 
JWT_REFRESH_SECRET_KEY = 
JWT_ACCESS_TOKEN_EXPIRES_TIME = 
JWT_REFRESH_TOKEN_EXPIRES_TIME = 


CLOUDINARY_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 
```
 
 #### 4. Enter the client directory and type 
 ```bash
npm install
```
#### 5. Enter the api directory and install all depedencies
 ```bash
npm install
```
#### 6. Start the application

Client
 ```bash
npm start
```

Api
 ```bash
node index
```

## Screenshots

### Registration form
![register](https://i.postimg.cc/8PFLDHjD/register.png)

<br/>
<br/>

### Login form
![login](https://i.postimg.cc/7PtSpcPm/login.png)

<br/>
<br/>

### Timeline
![timeline_dekstop_top](https://i.postimg.cc/tggDCFmY/68747470733a2f2f692e706f7374696d672e63632f44775a6e774c30632f74696d656c696e652e706e67.png)

![timeline_comments](https://i.postimg.cc/rF5t96NH/all-friends.png)

<br/>
<br/>

### Profile
![profile_one](https://i.postimg.cc/c4zd1Fqx/obraz.png)

<br/>
<br/>

### Friends profile
![profile_two](https://i.postimg.cc/sxVb0CZJ/user-profile.png)

<br/>
<br/>

### Profile edit
![profile_edit](https://i.postimg.cc/G35BRLqV/profile-edit.png)

<br/>
<br/>

### Live users searching
![searching](https://i.postimg.cc/3wx47kQM/searching.png)

<br/>
<br/>

### Mobile layout
![mobile_timeline](https://i.postimg.cc/sDjJfJYN/obraz.png) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp;  &nbsp; &nbsp;  &nbsp;  &nbsp;  
![mobile_profile](https://i.postimg.cc/L4N1DFPx/obraz.png)


   
