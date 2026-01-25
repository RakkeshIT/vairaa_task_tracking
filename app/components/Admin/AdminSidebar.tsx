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
} from "react-icons/fi";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";

export default function AdminSidebar({
  open,
  toggle,
}: {
  open: boolean;
  toggle: () => void;
}) {
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);

  return (
    <motion.div
      animate={{ width: open ? 260 : 70 }}
      className="relative bg-gray-900 text-white flex flex-col border-r border-white"
    >
      {/* Toggle Button */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-20 bg-gray-900 border border-gray-700 rounded-full p-1 z-50"
      >
        {open ? <IoIosArrowDropleft /> : <IoIosArrowDropright />}
      </button>

      {/* Logo */}
      <div className="h-16 flex items-center justify-center font-bold border-b border-gray-700">
        {open ? "Admin Panel" : "AP"}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">

        <Link href="/admin" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded">
          <FiHome /> {open && "Dashboard"}
        </Link>

        {/* Topics Dropdown */}
        <button
          onClick={() => setTopicsOpen(!topicsOpen)}
          className="w-full flex items-center justify-between p-2 hover:bg-gray-800 rounded"
        >
          <span className="flex items-center gap-3">
            <FiBook /> {open && "Topics"}
          </span>
          {open && (topicsOpen ? <FiChevronUp /> : <FiChevronDown />)}
        </button>

        {topicsOpen && open && (
          <div className="ml-8 space-y-1 text-sm">
            <Link href="/admin/topics/create" className="block hover:text-blue-400">
              Create Topic
            </Link>
            <Link href="/admin/topics/view" className="block hover:text-blue-400">
              View Topics
            </Link>
          </div>
        )}

        {/* Tasks Dropdown */}
        <button
          onClick={() => setTasksOpen(!tasksOpen)}
          className="w-full flex items-center justify-between p-2 hover:bg-gray-800 rounded"
        >
          <span className="flex items-center gap-3">
            <FiCheckSquare /> {open && "Tasks"}
          </span>
          {open && (tasksOpen ? <FiChevronUp /> : <FiChevronDown />)}
        </button>

        {tasksOpen && open && (
          <div className="ml-8 space-y-1 text-sm">
            <Link href="/admin/tasks/create" className="block hover:text-blue-400">
              Create Task
            </Link>
            <Link href="/admin/tasks/view" className="block hover:text-blue-400">
              View Tasks
            </Link>
            <Link href="/admin/tasks/assign" className="block hover:text-blue-400">
              Assign Task
            </Link>
          </div>
        )}
      </nav>
    </motion.div>
  );
}
