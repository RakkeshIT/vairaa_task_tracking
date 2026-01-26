"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { FiBook, FiClock, FiCalendar, FiCheck } from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";

export default function CreateTopicPage() {
  const [form, setForm] = useState({
    title: "",
    topic_date: "",
    duration: "",
    status: "active",
    section: '',
  });

  const [loading, setLoading] = useState(false);
  const {id} = useParams()
  const router = useRouter()
  console.log("id", id)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    fetchTopic()
  }, [])

  const fetchTopic = async () => {
    try{
        const {data, error} = await supabaseClient
        .from('topics')
        .select("*")
        .eq('id',id)
        .single()

        setForm({
            title: data.title,
            topic_date: data.topic_date,
            duration: String(data.duration),
            status: data.status,
            section: data.section,
        })

        if(error){
            console.log("Data Can not Fetch", error.message)
        }
    }catch(error) {
        console.log("Data Fetching Error", error)
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    const { error } = await supabaseClient.from("topics").update({
      title: form.title,
      topic_date: form.topic_date,
      duration: Number(form.duration),
      status: form.status,
      section: form.section
    })
    .eq('id', id);

    setLoading(false);
    router.push('/admin/topics/view')
    if (error) alert(error.message);
    else {
      alert("Topic Update Successfully ✅");
      setForm({ title: "", topic_date: "", duration: "", status: "active", section: '', });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gray-900 px-8 py-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FiBook className="text-blue-400" />
            Create New Topic
          </h1>
          <p className="text-gray-400 mt-2">Add a new learning topic to the curriculum</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Section</label>
            <select
              name="section"
              value={form.section}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">Select the Section</option>
              <option value="Javascript">Javascript</option>
              <option value="React JS">React Js</option>
              <option value="Mongo DB">Mongo DB</option>
              <option value="Node Js & Express Js">Node & Express Js</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Topic Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter topic title"
              required
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <FiCalendar />
                Date
              </label>
              <input
                type="date"
                name="topic_date"
                value={form.topic_date}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <FiClock />
                Duration
              </label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="Minutes"
                required
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </div>
            ) : (
              <>
                <FiCheck />
                Create Topic
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}