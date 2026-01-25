"use client";

import { FiMenu } from "react-icons/fi";

interface TopbarProps {
  toggleSidebar: () => void;
}

export default function Topbar({ toggleSidebar }: TopbarProps) {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 h-16 px-6 border-b border-gray-200 dark:border-gray-700">
      <button onClick={toggleSidebar} className="text-2xl md:hidden">
        <FiMenu />
      </button>
      <div className="flex items-center gap-4">
        <img
          src="/profile.jpg"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="font-medium">Rakkesh</span>
      </div>
    </div>
  );
}
