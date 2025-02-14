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
        created_at: "desc"
      },
      select: {
        id: true,
        payment_id: true,
        amount: true,
        currency: true,
        status: true,
        credits_added: true,
        payment_method: true,
        metadata: true,
        created_at: true
      }
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error("[PAYMENTS_HISTORY]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 