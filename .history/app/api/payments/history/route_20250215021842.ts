import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const payments = await db.payment.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error("[PAYMENTS_HISTORY]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 