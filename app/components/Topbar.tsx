"use client";

import { FiBell, FiSearch, FiSettings, FiUser, FiCamera } from "react-icons/fi";
import { useState, useEffect } from 'react';
import { supabaseClient } from "@/lib/supabaseClient";
import axios from "axios";
import { useRouter } from "next/navigation";
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

export default function Topbar() {
  const [notifications] = useState(3);
  const [user, setUser] = useState<TopbarUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileImageError, setProfileImageError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter()
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get("/api/auth-user")
      const authUser = res.data.data;
      const profileData = authUser.profileData || {}
      console.log("Auth User: ", authUser)
      if (res.status == 200) {
        setUser({
          ...authUser,
          student_id: authUser.user.student_id || '',
          avatar_url: profileData.avatar_url || ''
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
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await axios.delete('/api/set-cookie');
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Implement search functionality here
    }
  };

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-white to-amber-50/30 h-16 px-6 border-b border-amber-100 shadow-sm">

      {/* Left side - Search Bar */}
      <div className="flex items-center flex-1 max-w-2xl">
        <form onSubmit={handleSearch} className="relative w-full">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users, tasks, or reports..."
            className="w-full pl-12 pr-4 py-2.5 bg-white/90 backdrop-blur-sm border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent text-amber-800 placeholder-amber-400 transition-all duration-200"
          />
          {searchQuery && (
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 text-xs bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg hover:shadow-md transition-shadow"
            >
              Search
            </button>
          )}
        </form>
      </div>

      {/* Right side - Icons & Profile */}
      <div className="ml-auto flex items-center gap-6">
        {/* Notifications */}
        <div className="relative group">
          <button className="relative p-2.5 rounded-xl hover:bg-amber-50 transition-all duration-200">
            <FiBell className="text-amber-600 text-xl" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm">
                {notifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {/* <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-amber-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-4 border-b border-amber-50">
              <h4 className="font-semibold text-amber-800">Notifications</h4>
              <p className="text-sm text-amber-600">You have {notifications} unread</p>
            </div>
            <div className="p-2 max-h-80 overflow-y-auto">
              {[1, 2, 3].map((notif) => (
                <div key={notif} className="p-3 hover:bg-amber-50/50 rounded-lg transition-colors">
                  <p className="text-sm text-amber-800 font-medium">New user registered</p>
                  <p className="text-xs text-amber-600 mt-1">2 minutes ago</p>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-amber-50">
              <button className="w-full text-center text-sm text-amber-600 hover:text-amber-700 font-medium">
                View all notifications
              </button>
            </div>
          </div> */}
        </div>

        {/* Settings */}
        <button className="p-2.5 rounded-xl hover:bg-amber-50 transition-all duration-200 group">
          <FiSettings className="text-amber-600 text-xl group-hover:rotate-45 transition-transform duration-300" />
        </button>

        {/* Profile */}
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
                    onError={() => setProfileImageError(true)}
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
                    {user?.avatar_url && !profileImageError ? (
                      <Image
                        src={user.avatar_url}
                        alt={user?.user.full_name}
                        className="rounded-xl object-cover border-2 border-amber-300"
                        width={50}
                        height={50}
                        onError={() => setProfileImageError(true)}
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
    </div>
  );
}