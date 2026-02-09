// app/api/get-users/route.ts
import { supabaseRoleClient } from "@/lib/supabaseRoleClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { taskId } = await req.json();

    if (!taskId) {
      console.log("Task Is Not Found");
      return NextResponse.json(
        { message: "Task Id Not Found" },
        { status: 404 },
      );
    }

    const { data: task, error: taskError } = await supabaseRoleClient
      .from("assigned_tasks")
      .select("*")
      .eq("task_id", taskId)
      .eq("completed", false);

    if (taskError) {
      console.error("Supabase error:", taskError);
      return NextResponse.json(
        { message: "Error fetching users", taskError },
        { status: 500 },
      );
    }

    if (!task) {
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }
    const usersId = task.map((t) => t.user_id)
    console.log("Tasks: ", task)
    console.log("User Id: ", usersId);

    const { data: users, error } = await supabaseRoleClient
      .from("users")
      .select("*")
      .in("id", usersId);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { message: "Error fetching users", error },
        { status: 500 },
      );
    }

    if (!users) {
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }


    const { data: taskData, error:taskDataError } = await supabaseRoleClient
      .from("tasks")
      .select("*")
      .eq("id", taskId);

    if (taskDataError) {
      console.error("Supabase error:", taskDataError);
      return NextResponse.json(
        { message: "Error fetching Task", taskDataError },
        { status: 500 },
      );
    }

    if (!taskData) {
      console.error("Task Error error:", taskDataError);
      return NextResponse.json({ message: "No Task found" }, { status: 404 });
    }

    const totalUsers = users.length
    // const activeUsers = users.filter(user => user.status === 'active').length
    // const pendingUsers = users.filter(user => user.status === 'pending').length
    // const inactiveUsers = users.filter(user => user.status === 'inactive').length



    return NextResponse.json({
      message: "Users fetched successfully",
      users,
      taskData,
      stats: {
        totalUsers: totalUsers
      }
    });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { message: "Server error", error: err },
      { status: 500 },
    );
  }
}
