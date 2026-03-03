import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout: React.FC = () => {
  return (
    <div className='h-screen bg-white w-screen'>
      <Outlet/>
    </div>
  )
}

export default AuthLayout