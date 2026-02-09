"use client"

import { BookOpen, CheckCircle, Clock, AlertCircle, BarChart3, Filter, Plus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import TaskTable from "@/app/components/Table"
import axios from "axios"
import type { AssignedTask } from "@/app/types/task"
// Types
type TaskStatus = 'completed' | 'pending' | 'in-progress'
type TaskCategory = 'Javascript' | 'React JS' | 'Node Js & Express Js' | 'Next Js'

type User = {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
  student_id: string
  password: string
  remark: string
}

type TaskResponse = {
  users: User
  assignedTask: AssignedTask[]
  records: {
    totalTasks: number
    totalPendingTask: number
    totalCompletedTask: number
  }
}

export default function TaskDashboard() {
  const [activeCategory, setActiveCategory] = useState<TaskCategory>('Javascript')
  const [tasks, setTasks] = useState<TaskResponse | null>(null)
  // Filter tasks by active category

  // ====API====
  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const res = await axios.post('/api/get-task')
        setTasks(res.data.tasks)
        console.log("Response: ", res.data.tasks)
      } catch (error) {
        console.log("Fetching Error: ", error)
      } finally {

      }
    }
    fetchAllTasks()
  }, [])
  // =====Category =======
  const categories = [
    { id: 'Javascript' as TaskCategory, name: 'Javascript', color: 'bg-yellow-500', icon: 'JS' },
    { id: 'React JS' as TaskCategory, name: 'React JS', color: 'bg-blue-500', icon: '⚛️' },
    { id: 'Node Js & Express Js' as TaskCategory, name: 'Node Js & Express Js', color: 'bg-green-500', icon: '🚀' },
    { id: 'Next Js' as TaskCategory, name: 'Next Js', color: 'bg-gray-900', icon: '△' },
  ]
  // ======= Stats ======= (completed / total) //
  const totalByCompleted =
    tasks && tasks.records.totalTasks > 0
      ? ((tasks.records.totalCompletedTask / tasks.records.totalTasks) * 100).toFixed(0)
      : "0"
  
  const categoryTasks = tasks?.assignedTask.filter(
    t => t.tasks.section === activeCategory
  ) || []

  const completedCount = categoryTasks.filter(t => t.completed).length
  const inProgressCount = categoryTasks.filter(t => !t.completed).length
  const totalPoints = tasks?.users.remark
  return (
    <div className="w-full bg-white rounded-2xl p-6">
      {/* ==== Header ==== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl shadow-lg">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent">
              Your Tasks
            </h1>
            <p className="text-amber-600">Track and manage your coding journey</p>
          </div>
        </div>
      </div>

      {/* ==== Stats Cards ==== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Tasks Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-amber-800">Total Tasks</h3>
            <BarChart3 className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-amber-700">{tasks?.records.totalTasks}</p>
              <p className="text-amber-600 text-sm mt-2">All categories</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 flex items-center justify-center">
              <span className="text-amber-600 font-bold">📚</span>
            </div>
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-green-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-800">Completed</h3>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-green-700">{tasks?.records.totalCompletedTask}</p>
              <p className="text-green-600 text-sm mt-2">
                {totalByCompleted}% of total
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
              <span className="text-green-600 font-bold">🏆</span>
            </div>
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-red-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-800">Pending</h3>
            <Clock className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-red-700">{tasks?.records.totalPendingTask}</p>
              <p className="text-red-600 text-sm mt-2">Needs attention</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-100 to-pink-100 flex items-center justify-center">
              <span className="text-red-600 font-bold">⏰</span>
            </div>
          </div>
        </div>

        {/* Points Card */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Points Earned</h3>
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{totalPoints}</p>
              <p className="text-amber-100 text-sm mt-2">You Earned Points</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==== Category Tabs ==== */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-amber-800">Technology Categories</h2>
          <button className="flex items-center gap-2 px-3 py-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter</span>
          </button>
        </div>
        <div className="border-b border-amber-200 mb-8">
          <div className="flex gap-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`relative px-5 py-3 text-sm font-medium transition-all duration-200 ${activeCategory === category.id
                  ? 'text-amber-700'
                  : 'text-amber-500 hover:text-amber-600'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </div>

                {activeCategory === category.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-t" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==== Task Table ==== */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-amber-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-amber-800">
                {categories.find(c => c.id === activeCategory)?.name} Tasks
              </h2>

              <p className="text-amber-600">
                {categoryTasks.length} tasks in this category
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium">
                {completedCount} completed
              </div>

              <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
                {inProgressCount} in progress
              </div>
            </div>
          </div>
        </div>

        <TaskTable tasks={categoryTasks} />
      </div>


      {/* ==== Progress Summary ==== */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-lg">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">Overall Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-amber-600 mb-1">
                <span>Completion Rate</span>
                <span>%</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 h-3 rounded-full transition-all duration-500"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-amber-600 mb-1">
                <span>Points Progress</span>
                <span></span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-lg">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">Task Distribution</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="text-2xl font-bold text-green-700">{tasks?.records.totalCompletedTask}</div>
              <div className="text-green-600 text-sm mt-1">Completed</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200">
              <div className="text-2xl font-bold text-red-700">{tasks?.records.totalPendingTask}</div>
              <div className="text-red-600 text-sm mt-1">Pending</div>
            </div>
          </div>
          <p className="text-amber-600 text-sm mt-4 text-center">
          </p>
        </div>
      </div>
    </div>
  )
}