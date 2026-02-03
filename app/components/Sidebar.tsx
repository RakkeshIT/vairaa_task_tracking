"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiHome, FiBook, FiCheckSquare, FiBarChart2, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { useState } from 'react';
import Image from "next/image";
import Logo from '../assets/logo.png'
interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ open, toggleSidebar }: SidebarProps) {
  const [activeLink, setActiveLink] = useState("Overview");
  const links = [
    { name: "Overview", icon: <FiHome />, href: "/dashboard" },
    { name: "Daily Topics", icon: <FiBook />, href: "/dashboard/topics" },
    { name: "Tasks", icon: <FiCheckSquare />, href: "/dashboard/tasks" },
    // { name: "Stats", icon: <FiBarChart2 />, href: "/dashboard/stats" },
    // { name: "Profile", icon: <FiUser />, href: "/dashboard/profile" },
    // { name: "Settings", icon: <FiSettings />, href: "/dashboard/settings" },
  ];
  const router = useRouter();

  const handleLogout = async () => {
    const res = await axios.delete('/api/set-cookie');
    const data = res.data;
    if(data.success) {
      console.log("Logout Success");
      router.push('/auth/login');
    }
  };

  const handleLinkClick = (name: string) => {
    setActiveLink(name);
  };

  return (
    <motion.div
      animate={{ width: open ? 250 : 69 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className="relative bg-white  text-amber-900 flex flex-col shadow-lg"
    >
      {/* 🔥 Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full p-2 shadow-lg hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 z-50 transform hover:scale-110 hover:shadow-xl"
      >
        {open ? <IoIosArrowDropleft size={20} /> : <IoIosArrowDropright size={20} />}
      </button>

      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-amber-200 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <Image
            src={Logo}
            alt=""
            width={50}
            height={50}
            />
          </div>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent"
            >
              Vairaa Coders
            </motion.div>
          )}
        </div>
      </div>

      {/* Links Section */}
      <div className="flex-1 flex flex-col mt-6 px-3 space-y-1">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => handleLinkClick(link.name)}
            className={`flex items-center gap-4 py-3 px-3 rounded-xl transition-all duration-300 ${
              activeLink === link.name
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg transform scale-[0.9]'
                : 'hover:bg-gradient-to-r hover:from-amber-100 hover:to-yellow-50 hover:text-amber-700 hover:shadow-md'
            }`}
          >
            <span className={`text-xl ${activeLink === link.name ? 'text-white' : 'text-amber-600'}`}>
              {link.icon}
            </span>
            {open && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-medium"
              >
                {link.name}
              </motion.span>
            )}
          </Link>
        ))}
      </div>

      {/* Logout Section */}
      <div className="p-4 border-t border-amber-200">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-4 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] group"
        >
          <FiLogOut className="text-lg group-hover:rotate-12 transition-transform duration-300" />
          {open && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-medium"
            >
              Logout
            </motion.span>
          )}
        </button>
      </div>
    </motion.div>
  );
}