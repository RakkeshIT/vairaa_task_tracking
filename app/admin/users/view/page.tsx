"use client";

import { useState, useEffect } from "react";
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
  FiPlus,
  FiRefreshCw
} from "react-icons/fi";
import { LuUsers, LuCalendar, LuKey } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

type User = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  student_id?: string;
  created_at: string;
  status: "active" | "inactive" | "pending";
  created_by?: string;
  confirm_at?: string;
};

export default function UsersListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Fetch users from API
  const fetchUsers = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch('/api/get-user');
      const data = await response.json();
      
      if (response.ok) {
        const formattedUsers = data.users.map((user: any) => ({
          ...user,
          status: user.status || 'pending'
        }));
        setUsers(formattedUsers);
        toast.success(`Loaded ${formattedUsers.length} users`);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.student_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || user.role?.toLowerCase() === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    pending: users.filter(u => u.status === "pending").length,
    inactive: users.filter(u => u.status === "inactive").length
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return formatDate(dateString);
  };

  const getStatusBadge = (status: User["status"]) => {
    const styles = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      pending: "bg-amber-100 text-amber-800 border-amber-200"
    };

    const icons = {
      active: <FiUserCheck className="mr-1 text-sm" />,
      inactive: <FiUserX className="mr-1 text-sm" />,
      pending: <FiUserCheck className="mr-1 text-sm" />
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "from-amber-400 to-yellow-400",
      student: "from-blue-400 to-cyan-400",
      "job seeker": "from-green-400 to-emerald-400",
      work: "from-purple-400 to-pink-400",
      editor: "from-indigo-400 to-violet-400",
      subscriber: "from-gray-400 to-gray-500"
    };
    return colors[role.toLowerCase()] || "from-gray-400 to-gray-500";
  };

  const getAvatarColor = (id: string) => {
    const colors = [
      "from-amber-400 to-yellow-400",
      "from-blue-400 to-cyan-400",
      "from-green-400 to-emerald-400",
      "from-purple-400 to-pink-400",
      "from-red-400 to-orange-400",
      "from-indigo-400 to-purple-400",
      "from-teal-400 to-cyan-400",
      "from-amber-500 to-orange-400"
    ];
    const index = parseInt(id?.slice(-1) || '0', 10) % colors.length;
    return colors[index];
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success("User deleted successfully");
        fetchUsers(false);
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Student ID', 'Status', 'Created At', 'Created By'],
      ...filteredUsers.map(user => [
        user.full_name,
        user.email,
        user.role,
        user.student_id || 'N/A',
        user.status,
        formatDate(user.created_at),
        user.created_by || 'System'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Export started");
  };

  return (
    <div className="space-y-6">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'white',
            color: '#374151',
            border: '1px solid #fef3c7',
            borderRadius: '12px',
          },
        }}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl">
              <LuUsers className="text-amber-600 text-xl" />
            </div>
            User Management
            {loading && (
              <span className="text-sm font-normal text-amber-600 ml-2">
                Loading...
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-1">Manage and monitor all system users</p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-amber-200 text-amber-700 rounded-xl hover:bg-amber-50 transition-all disabled:opacity-70"
          >
            <FiRefreshCw className={`text-lg ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>

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
            onClick={handleExport}
            disabled={filteredUsers.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-amber-200 text-amber-700 rounded-xl hover:bg-amber-50 transition-all disabled:opacity-70"
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
                <span className="text-gray-500">Database</span>
                <span className={`font-medium ${stat.label === "Active" ? "text-green-600" :
                    stat.label === "Pending" ? "text-blue-600" : "text-gray-600"
                  }`}>
                  Live
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
                placeholder="Search users by name, email or student ID..."
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
                <option value="student">Student</option>
                <option value="admin">Administrator</option>
                <option value="job seeker">Job Seeker</option>
                <option value="work">Work</option>
                <option value="editor">Editor</option>
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
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <LuUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
            <p className="mt-2 text-gray-600">
              {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                ? "Try adjusting your search or filters"
                : "No users in the database yet"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-50 to-yellow-50/30 border-b border-amber-100">
                    <th className="text-left p-5 font-semibold text-gray-700">User</th>
                    <th className="text-left p-5 font-semibold text-gray-700">Role & ID</th>
                    <th className="text-left p-5 font-semibold text-gray-700">Status</th>
                    <th className="text-left p-5 font-semibold text-gray-700">Created</th>
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
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarColor(user.id)} flex items-center justify-center text-white font-bold text-lg`}>
                            {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{user.full_name || 'Unnamed User'}</p>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <FiMail className="text-xs" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r ${getRoleColor(user.role)} text-white`}>
                            {user.role}
                          </span>
                          {user.student_id && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <LuKey className="text-xs" />
                              {user.student_id}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-5">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="p-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <LuCalendar className="text-xs" />
                            {formatDate(user.created_at)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getTimeAgo(user.created_at)}
                            {user.created_by && ` • By ${user.created_by}`}
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push(`/admin/users/${user.id}`)}
                            className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FiEye />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <FiEdit2 />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <FiTrash2 />
                          </motion.button>
                          <div className="relative">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                              title="More Options"
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
                  disabled={true}
                >
                  Previous
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
                >
                  1
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 border border-amber-200 rounded-xl hover:bg-amber-50 transition-colors"
                  disabled={filteredUsers.length < 10}
                >
                  Next
                </motion.button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}