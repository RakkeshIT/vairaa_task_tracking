import { NextRequest, NextResponse } from "next/server";
import { supabaseRoleClient } from "@/lib/supabaseRoleClient";


export async function POST(req:NextRequest) {
    try {
        const body = await req.json()
        const {link, topicId} = body
        
        if(!link || !topicId){
            console.log("Link and Topic Id is reuired")
            return NextResponse.json({message: "Link and Id is Req"},{status: 400})
        }
        console.log("Link from Frontend: ", link)
        console.log("Topic is from Frontend: ", topicId)
        const {data: topic, error: topicError} = await supabaseRoleClient
        .from('topics')
        .update(
        { notes_link: link }
        )
        .select("*")
        .eq('id', topicId)
        .maybeSingle()
        

        if(!topic || topicError) {
            console.log("Update error: ", topicError?.message)
            return NextResponse.json({message: "Topic Link Update Error", error: topicError?.message}, {status: 500})
        }

        return NextResponse.json({message: "Link Stored Success", topic}, {status: 200})
    } catch (error) {
        console.log("Internal Server error: ", error)
        return NextResponse.json({message: "Internal Server error", error: error}, {status: 500})
    }
}