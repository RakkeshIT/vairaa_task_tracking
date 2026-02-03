"use client";

import { FiMenu, FiBell, FiSearch, FiHelpCircle, FiLogOut, FiUser, FiCamera } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getAuthenticatedUser } from "@/lib/auth";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

type TopbarUser = {
  user: {
    full_name: string;
    email: string;
    role: string;
  }
  student_id: string;
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
      const profileData = authUser.profileData || {}
      console.log("Auth User: ", res.data)
      if (res.status == 200) {
        setUser({
          ...authUser,
          student_id: authUser.user.student_id || '',
          avatar_url: profileData.avatar_url || ""
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
    return colors[role] || "from-gray-400 to-gray-500";
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
         <div className="relative group">
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-100 to-yellow-100 animate-pulse"></div>
                      <div className="hidden md:block space-y-2">
                        <div className="w-24 h-3 bg-amber-100 rounded animate-pulse"></div>
                        <div className="w-16 h-2 bg-amber-50 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 ml-2 p-1.5 pr-4 rounded-xl hover:bg-amber-50/80 transition-all duration-200 cursor-pointer">
                      <div className="relative">
                        {user?.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt={user.user.full_name}
                            className="w-10 h-10 rounded-xl object-cover border-2 border-amber-300 shadow-sm"
                            width={96}
                            height={96}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center text-white font-bold text-lg border-2 border-amber-300 shadow-sm">
                            {getInitials(user?.user.full_name || "User")}
                          </div>
                        )}
        
                        {/* Online Status Indicator */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
        
                      <div className="hidden md:block">
                        <h3 className="text-amber-800 font-semibold text-sm">
                          {user?.user.full_name || "Guest User"}
                        </h3>
                        <p className="text-amber-600 text-xs">
                          {user?.user.email ? user?.user.email.split('@')[0] : "Click to login"}
                        </p>
                        <p className="text-amber-600 text-xs">
                          {user?.student_id || ""}
                        </p>
                      </div>
                    </div>
                  )}
        
                  {/* Profile Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-amber-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {!user ? (
                      <div className="p-6 text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 flex items-center justify-center mb-4">
                          <FiUser className="text-amber-500 text-2xl" />
                        </div>
                        <p className="text-amber-700 font-medium mb-2">Not logged in</p>
                        <p className="text-amber-600 text-sm mb-4">Sign in to access your profile</p>
                        <button
                          onClick={() => window.location.href = "/login"}
                          className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg font-medium hover:shadow-md transition-shadow"
                        >
                          Sign In
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="p-4 border-b border-amber-50">
                          <div className="flex items-center gap-3">
                            {user?.avatar_url ? (
                              <Image
                                src={user.avatar_url}
                                alt={user?.user.full_name}
                                className="rounded-xl object-cover border-2 border-amber-300"
                                width={50}
                                height={50}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center text-white font-bold text-xl">
                                {getInitials(user?.user.full_name)}
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold text-amber-800">{user?.user.full_name}</h4>
                              <p className="text-xs text-amber-600 truncate">{user?.user.email}</p>
                            </div>
                          </div>
                        </div>
        
                        <div className="p-2">
                          <button
                            onClick={() => router.push("/dashboard/profile")}
                            className="w-full text-left px-4 py-3 rounded-lg hover:bg-amber-50 text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-3"
                          >
                            <FiUser className="text-amber-500" />
                            View Profile
                          </button>
                          {/* <button
                            className="w-full text-left px-4 py-3 rounded-lg hover:bg-amber-50 text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-3"
                          >
                            <FiSettings className="text-amber-500" />
                            Account Settings
                          </button> */}
                          {!user?.avatar_url && (
                            <button
                              onClick={() => router.push("/dashboard/profile?tab=photos")}
                              className="w-full text-left px-4 py-3 rounded-lg hover:bg-amber-50 text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-3 border-t border-amber-50 mt-2 pt-2"
                            >
                              <FiCamera className="text-blue-500" />
                              <div>
                                <p className="font-medium">Add Profile Photo</p>
                                <p className="text-xs text-blue-500">Personalize your account</p>
                              </div>
                            </button>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors flex items-center gap-3 mt-2 border-t border-amber-50 pt-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
      </div>
    </header>
  );
}