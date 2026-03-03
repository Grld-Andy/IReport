import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../custom/Footer'

const Layout: React.FC = () => {
  return (
    <div className='h-screen bg-blue-50'>
      <Outlet/>

      <Footer/>
    </div>
  )
}

export default Layout