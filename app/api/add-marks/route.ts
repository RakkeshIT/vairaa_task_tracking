import { supabaseRoleClient } from "@/lib/supabaseRoleClient";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const { userId, taskId, mark } = await req.json();

    if (!userId || !taskId || mark === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newMark = Number(mark);

    //  Get old mark from assign_tasks
    const { data: taskData, error: taskFetchError } = await supabaseRoleClient
      .from("assigned_tasks")
      .select("mark")
      .eq("user_id", userId)
      .eq("task_id", taskId)
      .single();

    if (taskFetchError && taskFetchError.code !== "PGRST116") {
      throw taskFetchError;
    }

    const oldTaskMark = taskData?.mark || 0;

    //Get current total mark from users table
    const { data: userData, error: userFetchError } = await supabaseRoleClient
      .from("users")
      .select("remark")
      .eq("id", userId)
      .single();

    if (userFetchError) throw userFetchError;

    const currentTotal = userData?.remark || 0;

    // Calculate new total correctly
    const updatedTotal = currentTotal - oldTaskMark + newMark;
    const updatedTotalStr = String(updatedTotal)
    // Update assign_tasks (replace with new mark)
    const { error: updateTaskError } = await supabaseRoleClient
      .from("assigned_tasks")
      .update({ mark: newMark, completed: true })
      .eq("user_id", userId)
      .eq("task_id", taskId);

    if (updateTaskError) throw updateTaskError;

    // 🔹 5️⃣ Update users total mark
    const { error: updateUserError } = await supabaseRoleClient
      .from("users")
      .update({ remark: updatedTotalStr })
      .eq("id", userId);

    if (updateUserError) throw updateUserError;

    return NextResponse.json({
      message: "Marks updated successfully",
      totalMark: updatedTotalStr,
    }, {status: 200});

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
