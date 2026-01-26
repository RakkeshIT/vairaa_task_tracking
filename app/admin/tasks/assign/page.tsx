"use client";

import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { FiCheckSquare } from "react-icons/fi";

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
}
const sections = ["Javascript", "React JS", "Node Js", "Express Js"];

export default function AssignTaskPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [selectedSection, setSelectedSection] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [assignToAll, setAssignToAll] = useState(false);

  const [loading, setLoading] = useState(false);

  // Load Sections & Users
  useEffect(() => {

    const fetchUsers = async () => {
      const { data } = await supabaseClient.from("users").select("*");
      setUsers(data || []);
    };

    fetchUsers();
  }, []);

  // Load Topics when section changes
  useEffect(() => {
    if (!selectedSection) return setTopics([]);
    const fetchTopics = async () => {
      const { data } = await supabaseClient
        .from("topics")
        .select("*")
        .eq("section", selectedSection);
      setTopics(data || []);
      setSelectedTopic(""); // reset topic
      setTasks([]); // reset tasks
      setSelectedTask("");
    };
    fetchTopics();
  }, [selectedSection]);

  // Load Tasks when topic changes
  useEffect(() => {
    if (!selectedTopic) return setTasks([]);
    const fetchTasks = async () => {
      const { data } = await supabaseClient
        .from("tasks")
        .select("*")
        .eq("topic_id", selectedTopic);
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

  // Assign Task
  const handleAssign = async () => {
    if (!selectedTask) return alert("Please select a task");
    setLoading(true);

    try {
      if (assignToAll) {
        // Assign to all users
        const { error } = await supabaseClient.from("assigned_tasks").insert(
          users.map((u) => ({
            user_id: u.id,
            task_id: selectedTask,
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
          }))
        );
        if (error) throw error;
      }

      alert("Task assigned successfully ✅");
      setSelectedUsers([]);
      setAssignToAll(false);
    } catch (err: any) {
      alert("Error assigning task: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Assign Task</h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Section */}
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">Select Section</option>
            {sections.map((s, i): any => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Topic */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="border rounded px-3 py-2"
            disabled={!selectedSection}
          >
            <option value="">Select Topic</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          {/* Task */}
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="border rounded px-3 py-2"
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

        {/* Assign Options */}
        <div className="flex items-center gap-4 mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={assignToAll}
              onChange={(e) => setAssignToAll(e.target.checked)}
            />
            Assign to all users
          </label>
          <button
            onClick={handleAssign}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            {loading ? "Assigning..." : "Assign Task"}
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={assignToAll}
                  onChange={(e) => setAssignToAll(e.target.checked)}
                />
              </th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={assignToAll || selectedUsers.includes(u.id)}
                    disabled={assignToAll}
                    onChange={() => handleUserCheckbox(u.id)}
                  />
                </td>
                <td className="px-4 py-2">{u.full_name}</td>
                <td className="px-4 py-2">{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
