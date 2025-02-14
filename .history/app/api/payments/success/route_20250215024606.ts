import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('payment_id')
    const status = searchParams.get('status')
    
    if (!paymentId) {
      return new NextResponse("Invalid Payment", { status: 400 })
    }

    // Check if payment already processed
    const { data: existingPayment } = await supabase
      .from('payments')
      .select()
      .eq('payment_id', paymentId)
      .single()

    if (existingPayment) {
      return NextResponse.json({ status: "already_processed" })
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
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        payment_id: paymentId,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        status: status,
        credits_added: paymentDetails.credits,
        payment_method: "card",
        metadata: {
          plan_name: paymentDetails.plan_name,
          description: paymentDetails.description
        }
      })

    if (paymentError) {
      console.error('Payment logging error:', paymentError)
      throw paymentError
    }

    // If payment succeeded, update user credits and log the transaction
    if (status === "succeeded") {
      // Update user credits
      const { data: currentCredits } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', user.id)
        .single()

      const newCredits = (currentCredits?.credits || 0) + paymentDetails.credits

      const { error: creditError } = await supabase
        .from('user_credits')
        .upsert({
          user_id: user.id,
          credits: newCredits,
          updated_at: new Date().toISOString()
        })

      if (creditError) {
        console.error('Credit update error:', creditError)
        throw creditError
      }

      // Log credit addition
      const { error: logError } = await supabase
        .from('credit_logs')
        .insert({
          user_id: user.id,
          amount: paymentDetails.credits,
          type: "received",
          description: `Credits from payment ${paymentId}`,
          metadata: {
            payment_id: paymentId,
            plan_name: paymentDetails.plan_name
          }
        })

      if (logError) {
        console.error('Credit log error:', logError)
        throw logError
      }
    }

    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("[PAYMENT_SUCCESS]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 