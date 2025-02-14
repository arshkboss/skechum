import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"
import { updateUserCredits } from "@/utils/credits"

export async function GET(req: Request) {
  try {
    const { userId } = auth()
    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('payment_id')
    const status = searchParams.get('status')
    
    if (!userId || !paymentId) {
      return new NextResponse("Unauthorized or Invalid Payment", { status: 401 })
    }

    // Check if payment already processed
    const existingPayment = await db.payment.findUnique({
      where: {
        payment_id: paymentId
      }
    })

    if (existingPayment) {
      return NextResponse.redirect(new URL('/profile', req.url))
    }

    // Get payment details from your payment provider
    // This is a placeholder - implement actual payment verification
    const paymentDetails = {
      amount: 1000, // $10.00
      currency: "USD",
      credits: 100,
      plan_name: "Basic Plan",
      description: "100 Credits Purchase"
    }

    // Log the payment
    const payment = await db.payment.create({
      data: {
        userId,
        payment_id: paymentId,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        status: status as "succeeded" | "failed",
        credits_added: paymentDetails.credits,
        payment_method: "card",
        metadata: {
          plan_name: paymentDetails.plan_name,
          description: paymentDetails.description
        }
      }
    })

    // If payment succeeded, add credits to user
    if (status === "succeeded") {
      await updateUserCredits(userId, paymentDetails.credits)
      
      // Log credit addition
      await db.creditLog.create({
        data: {
          userId,
          amount: paymentDetails.credits,
          type: "received",
          description: `Credits from payment ${paymentId}`,
          metadata: {
            payment_id: paymentId,
            plan_name: paymentDetails.plan_name
          }
        }
      })
    }

    // Redirect to profile page
    return NextResponse.redirect(new URL('/profile', req.url))
  } catch (error) {
    console.error("[PAYMENT_SUCCESS]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 