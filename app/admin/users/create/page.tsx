"use client";
import { useState } from "react";
import { FiUpload, FiUserPlus, FiMail, FiUser, FiFileText, FiCheck } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";

interface UserForm {
  full_name: string;
  email: string;
  role: string;
  password?: string;
}

export default function CreateUserPage() {
  const [form, setForm] = useState<UserForm>({
    full_name: "",
    email: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setBulkFile(file);
    setSelectedFileName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await toast.promise(
        axios.post('/api/create-user', { users: [form] }),
        {
          loading: 'Creating user...',
          success: (res) => {
            const studentId = res.data?.studentId || 'generated';
            return `User created successfully! Student ID: ${studentId}`;
          },
          error: (err) => `Error: ${err.response?.data?.message || 'Failed to create user'}`,
        }
      );

      setForm({ full_name: "", email: "", role: "student" });
    } catch (error) {
      console.log("Error", error);
    }
    setLoading(false);
  };

  const handleBulkSubmit = async () => {
    if (!bulkFile) return toast.error("Please upload a JSON file first!");
    setLoading(true);

    try {
      if (bulkFile.type !== "application/json") {
        throw new Error("Please upload a valid JSON file.");
      }

      const fileText = await bulkFile.text();
      const users: UserForm[] = JSON.parse(fileText);

      if (!Array.isArray(users)) {
        throw new Error("JSON must be an array of user objects.");
      }

      await toast.promise(
        axios.post("/api/create-user", { users }),
        {
          loading: `Creating ${users.length} users...`,
          success: `Successfully created ${users.length} users!`,
          error: (err) => `Error: ${err.response?.data?.message || 'Upload failed'}`,
        }
      );

      setBulkFile(null);
      setSelectedFileName("");
    } catch (err) {
      console.error("Bulk Upload Error: ", err);
      toast.error("Invalid JSON file format!");
    } finally {
      setLoading(false);
    }
  };

  const sendMail = async () => {
    try {
      await toast.promise(
        axios.post('/api/mail'),
        {
          loading: 'Sending emails...',
          success: 'Welcome emails sent successfully!',
          error: 'Failed to send emails',
        }
      );
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  const sendMailToStudents = async () => {
    try {
      await toast.promise(
        axios.post('/api/set-password/send-mail'),
        {
          loading: 'Sending emails...',
          success: 'Welcome emails sent successfully!',
          error: 'Failed to send emails',
        }
      );
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const roles = [
    { value: "student", label: "Student", color: "from-blue-400 to-cyan-400" },
    { value: "admin", label: "Administrator", color: "from-amber-400 to-yellow-400" },
    { value: "job seeker", label: "Job Seeker", color: "from-green-400 to-emerald-400" },
    { value: "work", label: "Work", color: "from-purple-400 to-pink-400" },
  ];

  return (
    <div className="space-y-6 m-12">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
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
              <FiUserPlus className="text-amber-600 text-xl" />
            </div>
            Create Users
          </h1>
          <p className="text-gray-600 mt-1">Add single users or bulk upload via JSON</p>
        </div>

        <div className="flex gap-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={sendMail}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <FiMail className="text-lg" />
          Send Emails and Pass To Me
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={sendMailToStudents}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <FiMail className="text-lg" />
          Send Welcome Emails
        </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Single User Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
              <FiUser className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Single User Creation</h2>
              <p className="text-sm text-gray-500">Create individual user accounts</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-amber-50/50 to-yellow-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all"
                    placeholder="Enter full name"
                  />
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-amber-50/50 to-yellow-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all"
                    placeholder="user@example.com"
                  />
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-amber-50/50 to-yellow-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent appearance-none"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <div className={`w-5 h-5 rounded-lg bg-gradient-to-br ${roles.find(r => r.value === form.role)?.color}`} />
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating User...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FiUserPlus className="text-lg" />
                  Create User Account
                </span>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Bulk Upload */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
              <LuUsers className="text-green-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Bulk User Upload</h2>
              <p className="text-sm text-gray-500">Upload JSON file with multiple users</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-amber-200 rounded-2xl p-6 bg-gradient-to-br from-amber-50/30 to-yellow-50/20 transition-all hover:border-amber-300">
              <input
                type="file"
                id="bulk-upload"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="bulk-upload" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <div className="p-4 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full mb-4">
                    <FiUpload className="text-amber-600 text-2xl" />
                  </div>
                  <p className="font-medium text-gray-700 mb-2">
                    Click to upload JSON file
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    Supports array of user objects in JSON format
                  </p>
                  <div className="px-4 py-2 bg-white border border-amber-200 rounded-lg text-sm text-amber-700">
                    Choose JSON File
                  </div>
                </div>
              </label>

              {selectedFileName && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <FiFileText className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{selectedFileName}</p>
                        <p className="text-xs text-gray-500">Ready for upload</p>
                      </div>
                    </div>
                    <FiCheck className="text-green-500" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* JSON Format Guide */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <FiFileText className="text-blue-600" />
                JSON Format Example
              </h4>
              <pre className="text-xs bg-white/80 rounded-lg p-3 overflow-x-auto border border-blue-100">
                {`[
  {
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  },
  {
    "full_name": "Jane Smith",
    "email": "jane@example.com",
    "role": "admin"
  }
]`}
              </pre>
            </div>

            <motion.button
              onClick={handleBulkSubmit}
              disabled={loading || !bulkFile}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FiUpload className="text-lg" />
                  {bulkFile ? `Upload ${selectedFileName}` : "Upload JSON File"}
                </span>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Created</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">142</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-400">
              <LuUsers className="text-white text-xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Activation</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">8</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400">
              <FiUser className="text-white text-xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Emails Sent</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">134</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-emerald-400">
              <FiMail className="text-white text-xl" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}