import React from 'react'
import { AppSidebar } from './AppSidebar'
import { SidebarProvider } from './ui/sidebar'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
const MainLayout = () => {
  return (
    <div>
      <SidebarProvider>
      <AppSidebar />
      <main className='w-full flex flex-col h-screen'>
        {/* <SidebarTrigger /> */}
        <Navbar/>
        {<Outlet/>}
      </main>
    </SidebarProvider>
    </div>
  )
}

export default MainLayout
