"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiHome, FiBook, FiCheckSquare, FiBarChart2, FiUser, FiLogOut } from "react-icons/fi";

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const links = [
    { name: "Overview", icon: <FiHome />, href: "/dashboard" },
    { name: "Daily Topics", icon: <FiBook />, href: "/dashboard/topics" },
    { name: "Tasks", icon: <FiCheckSquare />, href: "/dashboard/tasks" },
    { name: "Stats", icon: <FiBarChart2 />, href: "/dashboard/stats" },
    { name: "Profile", icon: <FiUser />, href: "/dashboard/profile" },
  ];

  return (
    <motion.div
      animate={{ width: open ? 250 : 60 }}
      className="bg-gray-800 text-white flex flex-col overflow-hidden transition-all duration-300"
    >
      <div className="flex items-center justify-center h-20 text-2xl font-bold border-b border-gray-700">
        {open ? "Vairaa Coders" : "VC"}
      </div>
      <div className="flex-1 flex flex-col mt-4">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center gap-4 py-3 px-4 hover:bg-gray-700 transition"
          >
            {link.icon}
            {open && <span>{link.name}</span>}
          </Link>
        ))}
      </div>
      <div className="p-4 border-t border-gray-700 flex items-center gap-4 cursor-pointer hover:bg-gray-700 transition">
        <FiLogOut /> {open && <span>Logout</span>}
      </div>
    </motion.div>
  );
}
