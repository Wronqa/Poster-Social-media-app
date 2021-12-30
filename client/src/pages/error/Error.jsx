import React from 'react'
import { Navbar } from '../../components/navbar/Navbar'

import './error.scss'

export const Error = () => {
  return (
    <div className='errorPageContainer'>
      <div className='errorPageWrapper'>
        <Navbar />
        <div className='errorPageContent'>
          <div className='errorPageTitle'>404</div>
          <div className='errorPageText'>Page not found!</div>
        </div>
      </div>
    </div>
  )
}
