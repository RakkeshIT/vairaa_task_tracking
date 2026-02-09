"use client"

import { CheckCircle, Clock, AlertCircle, MoreVertical, ExternalLink } from "lucide-react"
import type { AssignedTask } from "../types/task"

interface TaskTableProps {
  tasks: AssignedTask[]
}

export default function TaskTable({ tasks }: TaskTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  console.log("Tasks: ", tasks.map((t) => (t)))

//   const getStatusIcon = (status: TaskTableProps['sect']) => {
//     switch (status) {
//       case 'completed':
//         return <CheckCircle className="w-4 h-4 text-green-500" />
//       case 'in-progress':
//         return <Clock className="w-4 h-4 text-yellow-500" />
//       case 'pending':
//         return <AlertCircle className="w-4 h-4 text-red-500" />
//     }
//   }

//   const getPriorityBadge = (priority: Task['priority']) => {
//     const styles = {
//       high: 'bg-red-100 text-red-700 border-red-200',
//       medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
//       low: 'bg-green-100 text-green-700 border-green-200'
//     }
    
//     const labels = {
//       high: 'High',
//       medium: 'Medium',
//       low: 'Low'
//     }

//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[priority]}`}>
//         {labels[priority]}
//       </span>
//     )
//   }

  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-semibold text-amber-800 mb-2">No tasks found</h3>
        <p className="text-amber-600">Great job! All tasks in this category are completed.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-amber-50 border-b border-amber-200">
            <th className="text-left p-4 text-amber-700 font-semibold">Task</th>
            <th className="text-left p-4 text-amber-700 font-semibold">Status</th>
            <th className="text-left p-4 text-amber-700 font-semibold">Section</th>
            <th className="text-left p-4 text-amber-700 font-semibold"> </th>
            <th className="text-left p-4 text-amber-700 font-semibold">Due Date</th>
            <th className="text-left p-4 text-amber-700 font-semibold">Points</th>
            <th className="text-left p-4 text-amber-700 font-semibold">Your Points</th>
            <th className="text-left p-4 text-amber-700 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.tasks.id} className="border-b border-amber-100 hover:bg-amber-50/50 transition-colors">
              <td className="p-4">
                <div>
                  <h4 className="font-medium text-amber-800">{t.tasks.title}</h4>
                  <p className="text-sm text-amber-600 mt-1">{t.tasks.description}</p>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {t.tasks.status}
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {t.tasks.section}
                </div>
              </td>
              <td className="p-4">
                {t.tasks.difficulty}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-700">{formatDate(t.tasks.due_date)}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center justify-center w-12 h-8 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg">
                  <span className="font-bold text-amber-700">{t.tasks.max_marks}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}