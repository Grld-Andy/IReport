import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../custom/Sidebar'
// import Footer from '../custom/Footer'

const Layout: React.FC = () => {
  return (
    <div className='h-screen bg-white flex flex-row'>
      <Sidebar/>
      <div className='p-3 w-full'>
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout