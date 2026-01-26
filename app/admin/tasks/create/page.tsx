"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const sections = ["Javascript", "React JS", "Node Js", "Express Js"];

export default function CreateTaskPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    section: "Javascript",
    topic_id: "",
    due_date: "",
    max_marks: 10,
    difficulty: "medium",
    resource_link: "",
    status: "active",
  });

  useEffect(() => {
    fetchTopics();
  }, [form.section]);

  const fetchTopics = async () => {
    const { data } = await supabaseClient
      .from("topics")
      .select("id,title")
      .eq("section", form.section)
      .order("topic_date");

    setTopics(data || []);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabaseClient.from("tasks").insert(form);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Task created successfully ✅");
      router.push("/admin/tasks");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10 mt-5">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-500 mt-1">
            Assign tasks to students with deadline, marks, and resources
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Title */}
          <div className="col-span-2">
            <label className="block mb-2 font-medium text-gray-700">Task Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Build Todo App using React"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Section */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Section</label>
            <select
              name="section"
              value={form.section}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              {sections.map((s) => (
                <option key={s} value={s}>{s.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Related Topic</label>
            <select
              name="topic_id"
              value={form.topic_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="">-- Select Topic --</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block mb-2 font-medium text-gray-700">Task Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Explain what student should do..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Max Marks */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Max Marks</label>
            <input
              type="number"
              name="max_marks"
              value={form.max_marks}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Difficulty</label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Resource Link */}
          <div className="col-span-2">
            <label className="block mb-2 font-medium text-gray-700">Resource Link (Optional)</label>
            <input
              name="resource_link"
              value={form.resource_link}
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
