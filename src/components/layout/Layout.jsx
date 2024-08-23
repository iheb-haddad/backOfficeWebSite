import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from "sonner";

const Layout = () => {
  return (
    <>
        <Toaster richColors pauseOnHover style={{ bottom : '10vh'}}/>
        <Outlet />
    </>
  )
}

export default Layout