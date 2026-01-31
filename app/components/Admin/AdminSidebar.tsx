"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiChevronDown,
  FiChevronUp,
  FiBook,
  FiCheckSquare,
  FiHome,
  FiUsers,
  FiSettings,
  FiBarChart2
} from "react-icons/fi";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { LuLayoutDashboard } from "react-icons/lu";

export default function AdminSidebar({
  open,
  toggle,
}: {
  open: boolean;
  toggle: () => void;
}) {
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);

  const menuItems = [
    {
      icon: <LuLayoutDashboard className="text-xl" />,
      label: "Dashboard",
      href: "/admin",
      active: true
    },
    {
      icon: <FiUsers className="text-xl" />,
      label: "Users",
      href: "/admin/users/view",
      badge: 3
    },
    {
      icon: <FiBook className="text-xl" />,
      label: "Topics",
      dropdown: true,
      open: topicsOpen,
      setOpen: setTopicsOpen,
      subItems: [
        { label: "Create Topic", href: "/admin/topics/create" },
        { label: "View Topics", href: "/admin/topics/view" },
        { label: "Analytics", href: "/admin/topics/analytics" }
      ]
    },
    {
      icon: <FiCheckSquare className="text-xl" />,
      label: "Tasks",
      dropdown: true,
      open: tasksOpen,
      setOpen: setTasksOpen,
      subItems: [
        { label: "Create Task", href: "/admin/tasks/create" },
        { label: "View Tasks", href: "/admin/tasks/view" },
        { label: "Assign Task", href: "/admin/tasks/assign" },
        { label: "Progress", href: "/admin/tasks/progress" }
      ]
    },
    {
      icon: <FiBarChart2 className="text-xl" />,
      label: "Analytics",
      href: "/admin/analytics"
    },
    {
      icon: <FiSettings className="text-xl" />,
      label: "Settings",
      href: "/admin/settings"
    }
  ];

  return (
    <motion.aside
      animate={{ width: open ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-gradient-to-b from-white via-white to-amber-50/50 border-r border-amber-100 shadow-xl flex flex-col relative z-20"
    >
      {/* Toggle Button */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute -right-4 top-24 bg-white border border-amber-200 shadow-lg rounded-full p-2 z-50 hover:shadow-xl transition-shadow"
      >
        {open ? (
          <IoIosArrowDropleft className="text-amber-600 text-lg" />
        ) : (
          <IoIosArrowDropright className="text-amber-600 text-lg" />
        )}
      </motion.button>

      {/* Logo */}
      <div className="h-20 flex items-center px-4 border-b border-amber-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="font-bold text-gray-800 text-lg">AdminPro</span>
              <span className="text-xs text-amber-600 font-medium">Premium</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.dropdown ? (
              <>
                <button
                  onClick={() => item.setOpen(!item.open)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-amber-50/80 transition-all group"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-amber-600 group-hover:text-amber-700">
                      {item.icon}
                    </span>
                    {open && (
                      <span className="font-medium text-gray-700 group-hover:text-gray-900">
                        {item.label}
                      </span>
                    )}
                  </span>
                  {open && (
                    <motion.span
                      animate={{ rotate: item.open ? 180 : 0 }}
                      className="text-gray-400"
                    >
                      <FiChevronDown />
                    </motion.span>
                  )}
                </button>
                
                {item.open && open && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="ml-10 space-y-1 mt-1"
                  >
                    {item.subItems?.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className="block py-2 px-3 text-sm text-gray-600 hover:text-amber-700 hover:bg-amber-50/50 rounded-lg transition-all"
                      >
                        • {subItem.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </>
            ) : (
              <Link
                href={item.href || "#"}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50/80 transition-all group relative"
              >
                <span className="text-amber-600 group-hover:text-amber-700">
                  {item.icon}
                </span>
                {open && (
                  <>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="ml-auto bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {item.active && open && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-gradient-to-b from-amber-400 to-yellow-400 rounded-r-full"
                  />
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-t border-amber-100"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/profile.jpg"
                alt="Profile"
                className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Alex Johnson</p>
              <p className="text-xs text-amber-600">Administrator</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
}