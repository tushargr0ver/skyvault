import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from '@/lib/db'
import { storage } from "@/lib/db/schema"
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest, response: NextResponse) {
    const {userId} = await auth()
    if(!userId) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }
    const userStorage = await db.select().from(storage).where(eq(storage.userId, userId))
    return NextResponse.json({storage: userStorage}, {status: 200})
}

export async function POST(request: NextRequest, response: NextResponse) {
    const {userId} = await auth()
    if(!userId) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }
    
    const {size} = await request.json()
    if(size === 0) {
        return NextResponse.json({error: "Size cannot be 0"}, {status: 400})
    }
    if(size > 0) {
    const userStorage = await db.select().from(storage).where(eq(storage.userId, userId))
    
    const newUsedStorage = userStorage[0].usedStorage + size
    const newTotalFiles = userStorage[0].totalFiles! + 1
    await db.update(storage).set({usedStorage: newUsedStorage, totalFiles: newTotalFiles}).where(eq(storage.userId, userId))
    return NextResponse.json({message: "Storage updated"}, {status: 200})
    }
    else{
    const userStorage = await db.select().from(storage).where(eq(storage.userId, userId))
    const newUsedStorage = userStorage[0].usedStorage + size
    const newTotalFiles = userStorage[0].totalFiles! - 1
    await db.update(storage).set({usedStorage: newUsedStorage, totalFiles: newTotalFiles}).where(eq(storage.userId, userId))
    return NextResponse.json({message: "Storage updated"}, {status: 200})
    }
}