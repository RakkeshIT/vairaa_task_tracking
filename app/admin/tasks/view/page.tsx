"use client";

import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { FiCheckSquare } from "react-icons/fi";
import axios from "axios";
import { AlertWithInput } from "@/components/UsableAlert";

interface Topic {
    id: string;
    title: string;
    section: string;
}

interface Task {
    id: string;
    title: string;
    description?: string;
    topic_id: string;
}

interface User {
    id: string;
    full_name: string;
    email: string;
    student_id?: string;
}

const sections = ["Javascript", "React JS", "Node Js", "Express Js"];

export default function ViewTask() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0)
    const [selectedSection, setSelectedSection] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("");
    const [selectedTask, setSelectedTask] = useState("");

    const [selectedTaskData, setSelectedTaskData] = useState<Task | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const [loading, setLoading] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);

    /* -------------------- Load Topics -------------------- */
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
            setSelectedTopic("");
            setTasks([]);
            setSelectedTask("");
        };

        fetchTopics();
    }, [selectedSection]);

    /* -------------------- Load Tasks -------------------- */
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

    /* -------------------- Fetch Users + Task -------------------- */
    const handleAssign = async () => {
        if (!selectedTask) return;

        setLoading(true);
        setLoadingUsers(true);

        try {
            const res = await axios.post(
                "/api/get-user/get-assign-users",
                { taskId: selectedTask }
            );

            setUsers(res.data.users || []);
            setTotalUsers(res.data.users?.length || 0);
            // Store single task object (clean)
            const task = res.data.taskData?.[0] || null;
            setSelectedTaskData(task);
        } catch (error) {
            console.log("User fetch error:", error);
        } finally {
            setLoading(false);
            setLoadingUsers(false);
        }
    };

    const handleCompleteTask = (user: User) => {
        console.log(user.full_name);
        console.log(user.email);

        setSelectedUser(user);
    };

    const handleSubmitMark = async (mark: string) => {
        if (!selectedUser?.id || !activeTask?.id) {
            alert("User or Task not selected");
            return;
        }

        try {
            const res = await axios.post("/api/add-marks", {
                userId: selectedUser.id,
                taskId: activeTask.id,
                mark: mark,
            });
            const data = await res.data;

            if (res.status !== 200) {
                throw new Error(data.message || "Failed to update mark");
            }

            console.log("Updated Total Mark:", data.totalMark);

            alert("Mark updated successfully ✅");
            setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id))
            
        } catch (error: any) {
            console.error("Mark Update Error:", error.message);
            alert(error.message);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Assign Task</h1>
                    <p className="text-gray-600">
                        Select task and allow students to complete
                    </p>
                    <h2 className="font-semibold text-lg">
                        Total Users: {users.length}
                    </h2>
                </div>



                <motion.button
                    onClick={handleAssign}
                    disabled={!selectedTask || loading}
                    className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${!selectedTask || loading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        }`}
                >
                    <FiCheckSquare />
                    {loading ? "Please Wait..." : "Get Users"}
                </motion.button>
            </div>

            {/* Selection Card */}
            <div className="bg-white p-6 rounded-xl shadow space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                    {/* Section */}
                    <select
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="border p-3 rounded-lg"
                    >
                        <option value="">Select Section</option>
                        {sections.map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>

                    {/* Topic */}
                    <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        disabled={!selectedSection}
                        className="border p-3 rounded-lg"
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
                        disabled={!selectedTopic}
                        className="border p-3 rounded-lg"
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

            {/* Users Table */}
            <div className="overflow-x-auto bg-white shadow rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Student ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Email
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {loadingUsers ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8">
                                    Loading users...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-400">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm">
                                        {user.student_id || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {user.full_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm">{user.email}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => { setActiveTask(selectedTaskData), handleCompleteTask(user) }}
                                            disabled={!selectedTaskData}
                                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded-lg"
                                        >
                                            Complete Task
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {activeTask && (
                <AlertWithInput
                    isVisible={true}
                    name={selectedUser?.email}
                    value={selectedUser?.student_id}
                    onClose={() => setActiveTask(null)}
                    title={activeTask.title}
                    description={activeTask.description || ""}
                    placeholder="Please Enter Student Mark"
                    onSubmit={handleSubmitMark}
                />
            )}
        </div>
    );
}
