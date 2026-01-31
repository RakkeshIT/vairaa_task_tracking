"use client";

import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";

export default function UserDashboard() {
  const currentHour = new Date().getHours();
  let greeting = "Good evening";
  
  if (currentHour < 12) greeting = "Good morning";
  else if (currentHour < 18) greeting = "Good afternoon";

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-2xl"
      >
        {/* Profile Icon */}
        <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center mb-6">
          <FiUser className="text-amber-600 text-3xl" />
        </div>

        {/* Greeting */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {greeting}! Welcome back.
        </h1>

        {/* Welcome Text */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          We are glad to see you again. This is your personal dashboard where you can 
          manage your tasks and track your progress. Feel free to explore and get started!
        </p>

        {/* Date Display */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg mb-8">
          <span className="text-amber-700 font-medium">
            Today is {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>

        {/* Simple Actions */}
        {/* <div className="flex flex-wrap gap-3 justify-center">
          <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-medium hover:shadow-lg transition-all">
            View My Tasks
          </button>
          <button className="px-6 py-3 bg-white border border-amber-200 text-amber-700 rounded-xl font-medium hover:bg-amber-50 transition-all">
            Update Profile
          </button>
          <button className="px-6 py-3 bg-white border border-amber-200 text-amber-700 rounded-xl font-medium hover:bg-amber-50 transition-all">
            Explore Features
          </button>
        </div> */}

        {/* Help Text */}
        <p className="mt-8 text-gray-500 text-sm">
          Need help? Visit our help center or contact support.
        </p>
      </motion.div>
    </div>
  );
}