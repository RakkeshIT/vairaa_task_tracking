"use client";

import { FiMenu, FiBell, FiSearch, FiHelpCircle } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AdminTopbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <header className="h-20 bg-white/90 backdrop-blur-sm border-b border-amber-100 px-6 flex items-center justify-between shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="p-2 hover:bg-amber-50 rounded-xl text-gray-600 hover:text-amber-700 transition-all lg:hidden"
        >
          <FiMenu className="text-xl" />
        </motion.button>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex items-center bg-gradient-to-r from-amber-50/50 to-yellow-50/30 rounded-2xl px-4 py-2.5 border border-amber-200/50 w-80"
        >
          <FiSearch className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search dashboard..."
            className="bg-transparent w-full focus:outline-none text-gray-700 placeholder-gray-400"
          />
          <kbd className="hidden lg:inline-flex ml-2 text-xs px-2 py-1 bg-white border border-amber-200 rounded text-gray-500">
            ⌘K
          </kbd>
        </motion.div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Help & Notifications */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2.5 hover:bg-amber-50 rounded-xl text-gray-600 hover:text-amber-700 transition-all"
          >
            <FiHelpCircle className="text-xl" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2.5 hover:bg-amber-50 rounded-xl text-gray-600 hover:text-amber-700 transition-all"
          >
            <FiBell className="text-xl" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-amber-200 to-transparent hidden md:block"></div>

        {/* User Profile */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-amber-50/50 cursor-pointer transition-all"
        >
          <div className="relative">
            <img
              src="/profile.jpg"
              alt="Admin"
              className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-xs text-white font-bold">A</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <p className="font-semibold text-gray-800">Alex Johnson</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-xs text-amber-600 font-medium">Administrator</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-4 ml-4 pl-4 border-l border-amber-100">
            <div className="text-center">
              <p className="text-xs text-gray-500">Projects</p>
              <p className="font-bold text-gray-800">24</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Tasks</p>
              <p className="font-bold text-gray-800">128</p>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}