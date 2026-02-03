"use client";

import { FiMenu, FiBell, FiSearch, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getAuthenticatedUser } from "@/lib/auth";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import axios from "axios";

type TopbarUser = {
  full_name: string;
  email: string;
  role: string;
  avatar_url?: string;
};

export default function AdminTopbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const [user, setUser] = useState<TopbarUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const router = useRouter()
  useEffect(() => {
    fetchUserData();
  }, []);
  
    const fetchUserData = async () => {
    try {
      const res = await axios.get("/api/auth-user")
      const authUser = res.data;
      console.log("Auth User: ", res.data)
      if (res.status == 200) {
        setUser({
          ...authUser,
          student_id: authUser.student_id || ''
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = async () => {
     const res = await axios.delete('/api/set-cookie');
     const data = res.data;
     if(data.success) {
       console.log("Logout Success");
       router.push('/auth/login');
     }
   };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "from-amber-400 to-yellow-400",
      administrator: "from-amber-400 to-yellow-400",
      student: "from-blue-400 to-cyan-400",
      editor: "from-green-400 to-emerald-400",
      "job seeker": "from-purple-400 to-pink-400",
      work: "from-indigo-400 to-violet-400"
    };
    return colors[role.toLowerCase()] || "from-gray-400 to-gray-500";
  };

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
            title="Help Center"
          >
            <FiHelpCircle className="text-xl" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2.5 hover:bg-amber-50 rounded-xl text-gray-600 hover:text-amber-700 transition-all"
            title="Notifications"
          >
            <FiBell className="text-xl" />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </motion.button>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="p-2.5 hover:bg-red-50 rounded-xl text-gray-600 hover:text-red-600 transition-all hidden md:block"
            title="Logout"
          >
            <FiLogOut className="text-xl" />
          </motion.button>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-amber-200 to-transparent hidden md:block"></div>

        {/* User Profile */}
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-amber-100 to-yellow-100 animate-pulse"></div>
            <div className="hidden md:block space-y-2">
              <div className="w-24 h-3 bg-amber-100 rounded animate-pulse"></div>
              <div className="w-16 h-2 bg-amber-50 rounded animate-pulse"></div>
            </div>
          </div>
        ) : user ? (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-amber-50/50 cursor-pointer transition-all group"
          >
            <div className="relative">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-md"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.querySelector('.avatar-fallback')?.classList.remove('hidden');
                  }}
                />
              ) : (
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md`}>
                  {getInitials(user.full_name)}
                </div>
              )}

              {/* Fallback avatar (hidden by default) */}
              <div className={`avatar-fallback hidden w-11 h-11 rounded-xl bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md`}>
                {getInitials(user.full_name)}
              </div>

              <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getRoleColor(user.role)} rounded-full border-2 border-white flex items-center justify-center`}>
                <span className="text-xs text-white font-bold">
                  {user.role.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="hidden md:block">
              <p className="font-semibold text-gray-800 group-hover:text-amber-700 transition-colors">
                {user.full_name}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-xs text-amber-600 font-medium capitalize">
                  {user.role}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-4 ml-4 pl-4 border-l border-amber-100">
              <div className="text-center">
                <p className="text-xs text-gray-500">Today</p>
                <p className="font-bold text-gray-800">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
              </div>
            </div>

            {/* Dropdown Menu (Hidden by default, shows on hover) */}
            <div className="absolute right-6 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-amber-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-3 border-b border-amber-50">
                <p className="font-medium text-gray-800">{user.full_name}</p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => router.push("/admin/profile")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 text-gray-700 hover:text-amber-700 transition-colors"
                >
                  View Profile
                </button>
                <button
                  onClick={() => window.location.href = "/admin/settings"}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 text-gray-700 hover:text-amber-700 transition-colors"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors mt-2 border-t border-amber-50 pt-2"
                >
                  <FiLogOut className="inline mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center text-white font-bold text-lg">
              ?
            </div>
            <div className="hidden md:block">
              <p className="font-semibold text-gray-800">Guest User</p>
              <p className="text-xs text-amber-600 font-medium">Please login</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}