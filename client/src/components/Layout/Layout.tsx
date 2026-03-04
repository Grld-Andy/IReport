import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../custom/Sidebar'
// import Footer from '../custom/Footer'

const Layout: React.FC = () => {
  return (
    <div className='h-screen flex flex-row'>
      <div className='w-[90px] md:w-[230px] h-full'>
        <Sidebar/>
      </div>
      <div className='p-3 w-[calc(100%-90px)] md:w-[calc(100%-230px)] h-full overflow-y-scroll hide-scrollbar'>
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout