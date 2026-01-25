"use client";

import { FiMenu } from "react-icons/fi";
import {motion} from "framer-motion";
export default function AdminTopbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <header className="h-16 flex items-center py-6 px-6 border-b border-gray-500">
      <button onClick={toggleSidebar} className="text-xl md:hidden">
        <FiMenu />
      </button>

      <div className="ml-auto flex items-center gap-4">
        <span className="font-medium">Admin</span>
        <img
          src="/profile.jpg"
          className="w-9 h-9 rounded-full object-cover cursor-pointer "
        />
      </div>
    </header>
  );
}
