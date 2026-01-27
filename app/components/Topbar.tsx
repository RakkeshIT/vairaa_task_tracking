"use client";

import { FiBell, FiSearch, FiSettings } from "react-icons/fi";
import { useState } from 'react';

export default function Topbar() {
  const [notifications] = useState(3); // Example notification count

  return (
    <div className="flex items-center justify-between bg-white h-16 px-6 border-b border-amber-200 shadow-sm">
      
      {/* Left side - Search Bar */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-amber-800 placeholder-amber-400"
          />
        </div>
      </div>

      {/* Right side - Icons & Profile */}
      <div className="ml-auto flex items-center gap-4">
        
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-amber-100 transition-colors duration-200">
          <FiBell className="text-amber-600 text-xl" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>

        {/* Settings */}
        <button className="p-2 rounded-full hover:bg-amber-100 transition-colors duration-200">
          <FiSettings className="text-amber-600 text-xl" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 ml-4">
          <div className="relative">
            <img
              src="/profile.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-md"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="hidden md:block">
            <h3 className="text-amber-800 font-semibold">John Doe</h3>
            <p className="text-amber-600 text-sm">Premium User</p>
          </div>
        </div>
      </div>
    </div>
  );
}