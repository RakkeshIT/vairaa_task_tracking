// app/api/get-users/route.ts
import { supabaseClient } from "@/lib/supabaseClient"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { data: users, error } = await supabaseClient
      .from('users')
      .select('*')
      .neq("role", 'admin')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ message: "Error fetching users", error }, { status: 500 })
    }

    if (!users) {
      return NextResponse.json({ message: "No users found" }, { status: 404 })
    }

    const totalUsers = users.length
    const activeUsers = users.filter(user => user.status === 'active').length
    const pendingUsers = users.filter(user => user.status === 'pending').length
    const inactiveUsers = users.filter(user => user.status === 'inactive').length

    return NextResponse.json({
      message: "Users fetched successfully",
      users,
      stats: {
        totalUsers,
        activeUsers,
        pendingUsers,
        inactiveUsers
      }
    })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json({ message: "Server error", error: err }, { status: 500 })
  }
}