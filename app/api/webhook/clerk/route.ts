import { NextRequest, NextResponse } from "next/server"
import { db } from '@/lib/db'
import { storage } from "@/lib/db/schema"


export async function POST(request: NextRequest) {
    const payload = await request.json()
    const userId = payload.data.id

 if(!userId) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401})
}
try{
    await db.insert(storage).values({
    userId: userId,
    usedStorage: 0,
    totalFiles: 0
})
 return NextResponse.json({message: "User created"}, {status: 200})
} catch (error) {
    console.error(error)
    return NextResponse.json({error: "Internal server error"}, {status: 500})
}
}