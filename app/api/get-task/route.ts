// app/api/get-tasks/route.ts
import { supabaseClient } from "@/lib/supabaseClient"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-cookie")?.value

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    const { data, error } = await supabaseClient.auth.getUser(token)

    if (error || !data.user) {
      return NextResponse.json({ message: "Invalid token", error }, { status: 401 })
    }

    const {data: user, error:authError} = await supabaseClient
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single()

     if (!user || authError) {
      return NextResponse.json({ message: "User not get", error }, { status: 404 })
    }

    const {data: tasks, error: taskError} = await supabaseClient
    .from('tasks')
    .select('*')

     if (!tasks || taskError) {
      return NextResponse.json({ message: "Task not get", error }, { status: 404 })
    }

    const {data: assignedTask, error: assignedError} = await supabaseClient
    .from('assigned_tasks')
    .select(`*, tasks:task_id (*)`)
    .eq('user_id', data.user.id)


    if (!assignedTask || assignedError) {
      return NextResponse.json({ message: "Assigned Task not get", error:assignedError }, { status: 404 })
    }

    const totalTasks = assignedTask.length
    const totalPendingTask = assignedTask.filter((tasks) => !tasks.completed).length
    const totalCompletedTask = assignedTask.filter((tasks) => tasks.completed).length

    return NextResponse.json({
      message: "Tasks fetched successfully",
      tasks: {
        users: user,
        assignedTask: assignedTask,
        records: {
            totalTasks: totalTasks,
            totalPendingTask: totalPendingTask,
            totalCompletedTask: totalCompletedTask
        }
      }
    })
  } catch (err) {
    return NextResponse.json({ message: "Task cannot be fetched", error: err }, { status: 500 })
  }
}
