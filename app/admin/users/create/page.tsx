"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { FiUpload, FiUsers, FiUserPlus } from "react-icons/fi";

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
    if (e.target.files?.[0]) setBulkFile(e.target.files[0]);
  };

  // Generate Student ID
  const generateStudentID = async () => {
    const { count } = await supabaseClient
      .from("users")
      .select("id", { count: "exact", head: true });
    return `VCMERN${(count! + 101).toString().padStart(3, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const student_id = await generateStudentID();
    const password = Math.random().toString(36).slice(-8);

    const { data: authData, error: authError } =
      await supabaseClient.auth.admin.createUser({
        email: form.email,
        password,
        user_metadata: { full_name: form.full_name, student_id, role: form.role },
      });

    if (authError) {
      setLoading(false);
      alert(authError.message);
      return;
    }

    await supabaseClient.from("users").insert({
      id: authData.user?.id,
      student_id,
      full_name: form.full_name,
      email: form.email,
      role: form.role,
    });

    setLoading(false);
    alert(`User created! Student ID: ${student_id}`);
    setForm({ full_name: "", email: "", role: "student" });
  };

  const handleBulkSubmit = async () => {
    if (!bulkFile) return alert("Upload a file first!");
    setLoading(true);

    const text = await bulkFile.text();
    let users: UserForm[] = [];
    try {
      users = JSON.parse(text);
    } catch (err) {
      alert("Invalid JSON file!");
      setLoading(false);
      return;
    }

    for (let u of users) {
      const student_id = await generateStudentID();
      const password = Math.random().toString(36).slice(-8);

      const { data: authData } = await supabaseClient.auth.admin.createUser({
        email: u.email,
        password,
        user_metadata: { full_name: u.full_name, student_id, role: u.role },
      });

      await supabaseClient.from("users").insert({
        id: authData.user?.id,
        student_id,
        full_name: u.full_name,
        email: u.email,
        role: u.role,
      });
    }

    setLoading(false);
    alert("Bulk users created successfully!");
    setBulkFile(null);
  };

  return (
    <div className="min-h-screen flex bg-gray-100 p-6 md:p-12">
      {/* Left Side Image */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <img
          src="/students.png"
          alt="Students Illustration"
          className="w-3/4 h-auto object-contain"
        />
      </div>

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
              accept=".json"
              onChange={handleFileUpload}
              className="border p-3 rounded-lg flex-1"
            />
            <button
              onClick={handleBulkSubmit}
              disabled={loading || !bulkFile}
              className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {loading ? "Uploading..." : "Upload & Create Users"}
            </button>
          </div>
          <p className="mt-4 text-gray-500 text-sm">
            Upload JSON like: [{"{"} "full_name":"John Doe","email":"john@example.com","role":"student" {"}"}]
          </p>
        </div>
      </div>
    </div>
  );
}
