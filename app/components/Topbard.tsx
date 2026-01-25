"use client";

import { FiMenu } from "react-icons/fi";

export default function Topbar() {
  return (
    <div className="flex items-center bg-white dark:bg-gray-800 h-16 px-6 border-b border-gray-200 dark:border-gray-700">
  
  {/* Left side (logo / menu button if needed) */}
  <div>
    {/* You can add menu or title here later */}
  </div>

  {/* Right side (profile) */}
  <div className="ml-auto flex items-center gap-4">
    <img
      src="/profile.jpg"
      alt="Profile"
      className="w-10 h-10 rounded-full object-cover cursor-pointer"
    />
  </div>
</div>
  );
}
