import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const creditLogs = await db.creditLog.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(creditLogs)
  } catch (error) {
    console.error("[CREDITS_LOGS]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 