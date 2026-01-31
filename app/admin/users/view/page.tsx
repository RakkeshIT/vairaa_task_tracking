"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    FiSearch,
    FiFilter,
    FiMoreVertical,
    FiEdit2,
    FiTrash2,
    FiEye,
    FiMail,
    FiUserCheck,
    FiUserX,
    FiDownload,
    FiPlus
} from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { useRouter } from "next/navigation";

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: "active" | "inactive" | "pending";
    joinDate: string;
    lastActive: string;
    avatarColor: string;
    tasksCompleted: number;
};

export default function UsersListPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const router = useRouter()
    const users: User[] = [
        {
            id: 1,
            name: "Alex Johnson",
            email: "alex@example.com",
            role: "Administrator",
            status: "active",
            joinDate: "2024-01-15",
            lastActive: "2 hours ago",
            avatarColor: "from-amber-400 to-yellow-400",
            tasksCompleted: 128
        },
        {
            id: 2,
            name: "Sarah Miller",
            email: "sarah@example.com",
            role: "Editor",
            status: "active",
            joinDate: "2024-02-10",
            lastActive: "5 hours ago",
            avatarColor: "from-blue-400 to-cyan-400",
            tasksCompleted: 89
        },
        {
            id: 3,
            name: "Michael Chen",
            email: "michael@example.com",
            role: "Author",
            status: "pending",
            joinDate: "2024-03-01",
            lastActive: "1 day ago",
            avatarColor: "from-green-400 to-emerald-400",
            tasksCompleted: 42
        },
        {
            id: 4,
            name: "Emma Wilson",
            email: "emma@example.com",
            role: "Subscriber",
            status: "active",
            joinDate: "2024-01-20",
            lastActive: "30 minutes ago",
            avatarColor: "from-purple-400 to-pink-400",
            tasksCompleted: 56
        },
        {
            id: 5,
            name: "David Lee",
            email: "david@example.com",
            role: "Editor",
            status: "inactive",
            joinDate: "2024-02-28",
            lastActive: "2 weeks ago",
            avatarColor: "from-red-400 to-orange-400",
            tasksCompleted: 31
        },
        {
            id: 6,
            name: "Lisa Rodriguez",
            email: "lisa@example.com",
            role: "Administrator",
            status: "active",
            joinDate: "2024-01-05",
            lastActive: "Just now",
            avatarColor: "from-indigo-400 to-purple-400",
            tasksCompleted: 156
        },
        {
            id: 7,
            name: "James Wilson",
            email: "james@example.com",
            role: "Author",
            status: "pending",
            joinDate: "2024-03-15",
            lastActive: "3 days ago",
            avatarColor: "from-teal-400 to-cyan-400",
            tasksCompleted: 18
        },
        {
            id: 8,
            name: "Sophia Brown",
            email: "sophia@example.com",
            role: "Subscriber",
            status: "active",
            joinDate: "2024-02-22",
            lastActive: "1 hour ago",
            avatarColor: "from-amber-500 to-orange-400",
            tasksCompleted: 67
        }
    ];

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || user.role.toLowerCase() === filterRole;
        const matchesStatus = filterStatus === "all" || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const stats = {
        total: users.length,
        active: users.filter(u => u.status === "active").length,
        pending: users.filter(u => u.status === "pending").length,
        inactive: users.filter(u => u.status === "inactive").length
    };

    const getStatusBadge = (status: User["status"]) => {
        const styles = {
            active: "bg-green-100 text-green-800 border-green-200",
            inactive: "bg-gray-100 text-gray-800 border-gray-200",
            pending: "bg-amber-100 text-amber-800 border-amber-200"
        };

        const icons = {
            active: <FiUserCheck className="mr-1" />,
            inactive: <FiUserX className="mr-1" />,
            pending: <FiUserCheck className="mr-1" />
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
                {icons[status]}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="space-y-6 m-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl">
                            <LuUsers className="text-amber-600 text-xl" />
                        </div>
                        User Management
                    </h1>
                    <p className="text-gray-600 mt-1">Manage and monitor all system users</p>
                </div>

                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => router.push('/admin/users/create')}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                        <FiPlus className="text-lg" />
                        Add New User
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-amber-200 text-amber-700 rounded-xl hover:bg-amber-50 transition-all"
                    >
                        <FiDownload className="text-lg" />
                        Export
                    </motion.button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Users", value: stats.total, color: "from-amber-400 to-yellow-400", icon: <LuUsers /> },
                    { label: "Active", value: stats.active, color: "from-green-400 to-emerald-400", icon: <FiUserCheck /> },
                    { label: "Pending", value: stats.pending, color: "from-blue-400 to-cyan-400", icon: <FiEye /> },
                    { label: "Inactive", value: stats.inactive, color: "from-gray-400 to-gray-500", icon: <FiUserX /> }
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                                <div className="text-white text-xl">{stat.icon}</div>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-amber-50">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Last 30 days</span>
                                <span className={`font-medium ${stat.label === "Active" ? "text-green-600" :
                                        stat.label === "Pending" ? "text-blue-600" : "text-gray-600"
                                    }`}>
                                    {/* +{Math.floor(Math.random() * 20) + 5}% */}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-2xl p-5 border border-amber-100">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-amber-50/50 to-yellow-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="pl-10 pr-4 py-3 bg-gradient-to-r from-amber-50/50 to-yellow-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent appearance-none"
                            >
                                <option value="all">All Roles</option>
                                <option value="administrator">Administrator</option>
                                <option value="editor">Editor</option>
                                <option value="author">Author</option>
                                <option value="subscriber">Subscriber</option>
                            </select>
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 bg-gradient-to-r from-amber-50/50 to-yellow-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-amber-50 to-yellow-50/30 border-b border-amber-100">
                                <th className="text-left p-5 font-semibold text-gray-700">User</th>
                                <th className="text-left p-5 font-semibold text-gray-700">Role</th>
                                <th className="text-left p-5 font-semibold text-gray-700">Status</th>
                                <th className="text-left p-5 font-semibold text-gray-700">Tasks Completed</th>
                                <th className="text-left p-5 font-semibold text-gray-700">Last Active</th>
                                <th className="text-left p-5 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-amber-50 hover:bg-amber-50/30 transition-colors"
                                >
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${user.avatarColor} flex items-center justify-center text-white font-bold text-lg`}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{user.name}</p>
                                                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                                    <FiMail className="text-xs" />
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        {getStatusBadge(user.status)}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center">
                                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                                <div
                                                    className={`h-full rounded-full ${user.tasksCompleted > 100 ? "bg-gradient-to-r from-green-400 to-emerald-400" :
                                                            user.tasksCompleted > 50 ? "bg-gradient-to-r from-amber-400 to-yellow-400" :
                                                                "bg-gradient-to-r from-blue-400 to-cyan-400"
                                                        }`}
                                                    style={{ width: `${Math.min(100, (user.tasksCompleted / 200) * 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-medium text-gray-800">{user.tasksCompleted}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-gray-600">
                                        {user.lastActive}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                                                title="View"
                                            >
                                                <FiEye />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <FiEdit2 />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <FiTrash2 />
                                            </motion.button>
                                            <div className="relative">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                                                >
                                                    <FiMoreVertical />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer & Pagination */}
                <div className="p-5 border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-600">
                        Showing <span className="font-semibold text-gray-800">{filteredUsers.length}</span> of{" "}
                        <span className="font-semibold text-gray-800">{users.length}</span> users
                    </p>

                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 border border-amber-200 rounded-xl hover:bg-amber-50 transition-colors"
                        >
                            Previous
                        </motion.button>

                        {[1, 2, 3, 4, 5].map((num) => (
                            <motion.button
                                key={num}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 rounded-xl transition-colors ${num === 1
                                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
                                        : "hover:bg-amber-50 border border-transparent"
                                    }`}
                            >
                                {num}
                            </motion.button>
                        ))}

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 border border-amber-200 rounded-xl hover:bg-amber-50 transition-colors"
                        >
                            Next
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}