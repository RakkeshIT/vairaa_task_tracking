"use client";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { FiUpload, FiUsers, FiUserPlus } from "react-icons/fi";
import { supabaseRoleClient } from "@/lib/supabaseRoleClient";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setBulkFile(e.target.files[0]);
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try{  
      const res = await axios.post('/api/create-user', {users: [form]})
      alert(`User created! Student ID:`);
      setForm({ full_name: "", email: "", role: "student" });
    } catch(error){
      console.log("Error", error)
    }
    setLoading(false);
  };

 const handleBulkSubmit = async () => {
  if (!bulkFile) return alert("Upload a file first!");
  setLoading(true);

  try {
    // 1️⃣ Ensure the file is JSON
    if (bulkFile.type !== "application/json") {
      throw new Error("Please upload a valid JSON file.");
    }
    // 2️⃣ Read file once
    const fileText = await bulkFile.text();
    // 3️⃣ Parse JSON
    const users: UserForm[] = JSON.parse(fileText);
    // 4️⃣ Validate array
    if (!Array.isArray(users)) {
      throw new Error("JSON must be an array of user objects.");
    }
    console.log("Parsed users: ", users);
    // 5️⃣ Send to backend API
    const res = await axios.post("/api/create-user", { users });
    alert("Bulk users created successfully!");
    setBulkFile(null);
  } catch (err) {
    console.error("Bulk Upload Error: ", err);
    alert("Invalid JSON file! Make sure it's a valid array of user objects.");
  } finally {
    setLoading(false);
  }
};

// Send Mail
const sendMail = async () =>{
  try{
    const res = axios.post('/api/mail')
  alert("Mail Sent")
}catch(error){
  console.log("Error: ", error)
}
}

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12">
      <Button className="bg-blue-600" onClick={sendMail}>
        Send Mail With Users details
      </Button>

      {/* Right Side */}
      <div className="flex-1 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
          <FiUserPlus className="text-blue-600" /> Create Students
        </h1>

        {/* Single User Form */}
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Single User
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-600">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="John Doe"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="john@example.com"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-600">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="job seeker">Job Seeker</option>
                <option value="work">Work</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {loading ? "Creating..." : "Create Student"}
              </button>
            </div>
          </form>
        </div>

        {/* Bulk Upload */}
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
            <FiUpload className="text-green-600" /> Bulk Upload
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="border p-3 rounded-lg flex-1"
            />
            <button
              onClick={handleBulkSubmit}
              disabled={loading || !bulkFile}
              className="bg-indigo-400 cursor-pointer"
            >
              {loading ? "Uploading..." : "Upload & Create Users"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
