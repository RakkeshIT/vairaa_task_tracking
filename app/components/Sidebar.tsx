"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiHome, FiBook, FiCheckSquare, FiBarChart2, FiUser, FiLogOut } from "react-icons/fi";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ open, toggleSidebar }: SidebarProps) {
  const links = [
    { name: "Overview", icon: <FiHome />, href: "/dashboard" },
    { name: "Daily Topics", icon: <FiBook />, href: "/dashboard/topics" },
    { name: "Tasks", icon: <FiCheckSquare />, href: "/dashboard/tasks" },
    { name: "Stats", icon: <FiBarChart2 />, href: "/dashboard/stats" },
    { name: "Profile", icon: <FiUser />, href: "/dashboard/profile" },
  ];

  return (
    <motion.div
      animate={{ width: open ? 250 : 64 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className="relative bg-gray-800 text-white flex flex-col"
    >
      {/* 🔥 Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-2 top-24 bg-gray-800 border border-gray-700 rounded-full p-1 shadow-lg hover:bg-gray-700 transition z-50"
      >
        {open ? <IoIosArrowDropleft size={22} /> : <IoIosArrowDropright size={22} />}
      </button>

      {/* Logo */}
      <div className="flex items-center justify-center h-20 text-xl font-bold border-b border-gray-700">
        {open ? "Vairaa Coders" : "VC"}
      </div>

      {/* Links */}
      <div className="flex-1 flex flex-col mt-4">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center gap-4 py-3 px-4 hover:bg-gray-700 transition"
          >
            <span className="text-lg">{link.icon}</span>
            {open && <span>{link.name}</span>}
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700 flex items-center gap-4 cursor-pointer hover:bg-gray-700 transition">
        <FiLogOut />
        {open && <span>Logout</span>}
      </div>
    </motion.div>
  );
}
