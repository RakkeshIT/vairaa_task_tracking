"use client";

import { useState, useEffect, useMemo } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { FiCheckSquare, FiSearch, FiUser, FiMail, FiHash } from "react-icons/fi";

interface Section {
  id: number;
  name: string;
}

interface Topic {
  id: number;
  title: string;
  section: string;
}

interface Task {
  id: number;
  title: string;
  topic_id: number;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  student_id?: string;
}

const sections = ["Javascript", "React JS", "Node Js", "Express Js"];

export default function AssignTaskPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedSection, setSelectedSection] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [assignToAll, setAssignToAll] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.full_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.student_id?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  // Load Sections & Users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const { data, error } = await supabaseClient
          .from("users")
          .select("*")
          .order("full_name", { ascending: true });
        
        if (error) throw error;
        setUsers(data || []);
      } catch (err: any) {
        console.error("Error fetching users:", err.message);
        alert("Failed to load users");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Load Topics when section changes
  useEffect(() => {
    if (!selectedSection) {
      setTopics([]);
      return;
    }
    
    const fetchTopics = async () => {
      const { data } = await supabaseClient
        .from("topics")
        .select("*")
        .eq("section", selectedSection)
        .order("title", { ascending: true });
      setTopics(data || []);
      setSelectedTopic(""); // reset topic
      setTasks([]); // reset tasks
      setSelectedTask("");
    };
    fetchTopics();
  }, [selectedSection]);

  // Load Tasks when topic changes
  useEffect(() => {
    if (!selectedTopic) {
      setTasks([]);
      return;
    }
    
    const fetchTasks = async () => {
      const { data } = await supabaseClient
        .from("tasks")
        .select("*")
        .eq("topic_id", selectedTopic)
        .order("title", { ascending: true });
      setTasks(data || []);
      setSelectedTask("");
    };
    fetchTasks();
  }, [selectedTopic]);

  // Handle User Checkbox
  const handleUserCheckbox = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  // Handle Select All Users (excluding assign to all toggle)
  const handleSelectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  // Assign Task
  const handleAssign = async () => {
    if (!selectedTask) {
      alert("Please select a task");
      return;
    }
    
    setLoading(true);

    try {
      if (assignToAll) {
        // Assign to all users
        const { error } = await supabaseClient.from("assigned_tasks").insert(
          users.map((u) => ({
            user_id: u.id,
            task_id: selectedTask,
            assigned_at: new Date().toISOString(),
          }))
        );
        if (error) throw error;
      } else {
        // Assign to selected users
        if (selectedUsers.length === 0) {
          alert("Select at least one user or choose assign to all");
          setLoading(false);
          return;
        }
        const { error } = await supabaseClient.from("assigned_tasks").insert(
          selectedUsers.map((id) => ({
            user_id: id,
            task_id: selectedTask,
            assigned_at: new Date().toISOString(),
          }))
        );
        if (error) throw error;
      }

      alert("Task assigned successfully ✅");
      setSelectedUsers([]);
      setAssignToAll(false);
    } catch (err: any) {
      console.error("Error assigning task:", err);
      alert("Error assigning task: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Assign Task</h1>
          <p className="text-gray-600 mt-1">Select a task and assign it to users</p>
        </div>
        <motion.button
          onClick={handleAssign}
          disabled={loading || !selectedTask}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
            loading || !selectedTask
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
          }`}
          whileHover={!loading && selectedTask ? { scale: 1.02 } : {}}
          whileTap={!loading && selectedTask ? { scale: 0.98 } : {}}
        >
          <FiCheckSquare className="text-lg" />
          {loading ? "Assigning..." : "Assign Task"}
        </motion.button>
      </div>

      {/* Form Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-6"
      >
        <h2 className="text-lg font-semibold text-gray-800">Task Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select Section</option>
              {sections.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed"
              disabled={!selectedSection}
            >
              <option value="">Select Topic</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Task */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task
            </label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed"
              disabled={!selectedTopic}
            >
              <option value="">Select Task</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Assign Options */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={assignToAll}
                onChange={(e) => setAssignToAll(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <span className="text-gray-700 font-medium group-hover:text-gray-900">
              Assign to all users ({users.length})
            </span>
          </label>
          
          {!assignToAll && selectedUsers.length > 0 && (
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
              <span className="font-medium">{selectedUsers.length}</span> user(s) selected
            </div>
          )}
        </div>
      </motion.div>

      {/* Users Table Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Users List</h2>
              <p className="text-gray-600 text-sm mt-1">
                Total: {users.length} users • Showing: {filteredUsers.length} users
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or student ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4">
                  <div className="flex items-center">
                    {!assignToAll && (
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAllUsers}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={assignToAll || filteredUsers.length === 0}
                      />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FiHash className="text-sm" />
                    Student ID
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-sm" />
                    Name
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FiMail className="text-sm" />
                    Email
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loadingUsers ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-gray-500 mt-2">Loading users...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <FiSearch className="w-12 h-12 mx-auto mb-3" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm">
                        {searchQuery ? "Try a different search term" : "No users available"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <motion.tr 
                    key={user.id} 
                    className="hover:bg-blue-50/30 transition-colors duration-150"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={assignToAll || selectedUsers.includes(user.id)}
                          disabled={assignToAll}
                          onChange={() => handleUserCheckbox(user.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {user.student_id || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {user.full_name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {user.full_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{user.email}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}