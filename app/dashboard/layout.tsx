'use client'
import React, { useState } from 'react'
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbard';
import {motion} from 'framer-motion';
const dashlayout = ({children}:{children: React.ReactNode}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar open={sidebarOpen} toggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <motion.main
          className="flex-1 overflow-auto p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}

export default dashlayout