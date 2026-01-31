// app/api/get-tasks/route.ts
import { supabaseClient } from "@/lib/supabaseClient"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {

    const {data: user, error:authError} = await supabaseClient
    .from('users')
    .select('*')
    .eq('role', 'student')

     if (!user) {
      return NextResponse.json({ message: "User not get", error: authError }, { status: 404 })
    }
    if(authError){
       return NextResponse.json({ message: "Error in Fetching user", error: authError }, { status: 500 })
    }

    const totalUsers = user.length

    return NextResponse.json({
      message: "Users fetched successfully",
      tasks: {
        users: user,
        record:{
            totalUsers: totalUsers
        }
      }
    })
  } catch (err) {
    return NextResponse.json({ message: "Users cannot be fetched", error: err }, { status: 500 })
  }
}
