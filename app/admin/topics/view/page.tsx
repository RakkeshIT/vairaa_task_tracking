"use client";

import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { FiBook, FiClock, FiCalendar, FiSearch, FiEdit, FiTrash2, FiEye, FiPlus, FiFilter } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ListCheckIcon } from "lucide-react";

const sections = ['Javascript', 'React JS', 'Node Js & Express Js']
export default function TopicsTablePage() {
    const [topics, setTopics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const router = useRouter();
    // Fetch topics
    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const { data, error } = await supabaseClient
                .from("topics")
                .select("*")
                .order("topic_date", { ascending: false });

            if (error) throw error;
            setTopics(data);
        } catch (error) {
            console.error("Error fetching topics:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter topics
    const filteredTopics = topics.filter(topic => {
        const matchesSearch =
            topic.title?.toLowerCase().includes(search.toLowerCase()) ||
            topic.id?.toString().includes(search);

        const matchesStatus =
            filterStatus === "all" ||
            topic.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const sectionTopic = (sec: string) => 
        filteredTopics.filter((t) => t.section == sec)
    

    // Delete topic
    const handleDelete = async (id: any) => {
        if (!confirm("Are you sure you want to delete this topic?")) return;

        const { error } = await supabaseClient
            .from("topics")
            .delete()
            .eq("id", id);

        if (error) {
            alert("Error deleting topic: " + error.message);
        } else {
            setTopics(topics.filter(topic => topic.id !== id));
            alert("Topic deleted successfully");
        }
    };

    // Format date
    const formatDate = (dateString: any) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                                <FiBook className="text-blue-600" />
                                Topics Management
                            </h1>
                            <p className="text-gray-600 mt-2">Manage all learning topics in one place</p>
                        </div>
                        <Link href="/admin/topics/create">
                            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
                                <FiPlus />
                                Create New Topic
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Topics</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{topics.length}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <FiBook className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Active Topics</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">
                                    {topics.filter(t => t.status === "active").length}
                                </p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <div className="w-6 h-6 rounded-full bg-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Hours</p>
                                <p className="text-2xl font-bold text-purple-600 mt-1">
                                    {Math.round(topics.reduce((acc, t) => acc + (t.duration || 0), 0) / 60)}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <FiClock className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Showing</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{filteredTopics.length}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <FiFilter className="text-gray-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-xl p-6 shadow border border-gray-100 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search topics by title or ID..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-4">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            <button
                                onClick={() => {
                                    setSearch("");
                                    setFilterStatus("all");
                                }}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}

                {
                    sections.map((sec: any, i: any) =>{
                        const list = sectionTopic(sec)
                        console.log("List",list)
                        return (
                        <div key={i} className="bg-white rounded-xl shadow overflow-hidden border border-gray-100 mb-4">
                             {/* SECTION HEADER */}
                            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                                <h2 className="text-lg font-semibold capitalize">{sec}</h2>
                                <span className="text-sm text-gray-500">
                                {list?.length || 0} Topics
                                </span>
                            </div>
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : list.length === 0 ? (
                                <div className="text-center py-16">
                                    <FiBook className="mx-auto text-gray-400" size={48} />
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">No topics found</h3>
                                    <p className="mt-1 text-gray-500">
                                        {search || filterStatus !== "all" ? "Try adjusting your filters" : "Get started by creating a new topic"}
                                    </p>
                                    {!(search || filterStatus !== "all") && (
                                        <Link href="/topics/create" className="mt-4 inline-block">
                                            <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                <FiPlus />
                                                Create New Topic
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto ">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Topic Title
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-1">
                                                        <FiCalendar />
                                                        Date
                                                    </div>
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-1">
                                                        <FiClock />
                                                        Duration
                                                    </div>
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {list.map((topic: any, index) => (
                                                <motion.tr
                                                    key={topic.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-mono text-gray-500">{index + 1}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                                                                <FiBook className="text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {topic.title || "Untitled Topic"}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    Created {new Date(topic.created_at).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {formatDate(topic.topic_date)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex items-center gap-2">
                                                                <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                                                    {topic.duration} min
                                                                </div>
                                                                <span className="text-sm text-gray-500">
                                                                    ({Math.floor(topic.duration / 60)}h {topic.duration % 60}m)
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${topic.status === "active"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                            }`}>
                                                            {topic.status === "active" ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => {/* View logic */ }}
                                                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="View"
                                                            >
                                                                <FiEye />
                                                            </button>
                                                            <button
                                                                onClick={() => router.push(`/admin/topics/create/${topic.id}`)}
                                                                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <FiEdit />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(topic.id)}
                                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <FiTrash2 />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination (optional) */}
                            {filteredTopics.length > 0 && (
                                <div className="border-t border-gray-200 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Showing <span className="font-medium">1</span> to{" "}
                                            <span className="font-medium">{filteredTopics.length}</span> of{" "}
                                            <span className="font-medium">{filteredTopics.length}</span> results
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                                                Previous
                                            </button>
                                            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                    })
                }
            </div>
        </div>
    );
}