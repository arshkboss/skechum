import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { getPaymentDetails } from "@/utils/dodo-payments"

export async function POST(req: Request) {
  try {
    console.log('Payment success handler started')
    const supabase = await createClient()
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('payment_id')
    const status = searchParams.get('status')
    
    console.log('Processing payment:', { paymentId, status, userId: user.id })
    
    if (!paymentId) {
      return NextResponse.json(
        { message: "Invalid Payment ID" },
        { status: 400 }
      )
    }

    // Check if payment already processed
    const { data: existingPayment, error: checkError } = await supabase
      .from('payments')
      .select()
      .eq('payment_id', paymentId)
      .single()

    if (checkError) {
      console.error('Error checking existing payment:', checkError)
    }

    if (existingPayment) {
      return NextResponse.json({ status: "already_processed" })
    }

    // Get actual payment details from DodoPayments
    const paymentDetails = await getPaymentDetails(paymentId)
    console.log('Payment details retrieved:', paymentDetails)

    // Calculate credits based on amount (customize this based on your pricing)
    const creditsToAdd = Math.floor(paymentDetails.total_amount / 100) // Example: 1 credit per INR

    // Log the payment
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        payment_id: paymentId,
        amount: paymentDetails.total_amount,
        currency: paymentDetails.currency,
        status: paymentDetails.status,
        credits_added: creditsToAdd,
        payment_method: paymentDetails.payment_method,
        metadata: {
          customer: paymentDetails.customer,
          product_cart: paymentDetails.product_cart,
          tax: paymentDetails.tax,
          business_id: paymentDetails.business_id
        }
      })

    if (paymentError) {
      console.error('Payment logging error:', paymentError)
      throw paymentError
    }

    // If payment succeeded, update user credits and log the transaction
    if (paymentDetails.status === "succeeded") {
      // Update user credits
      const { data: currentCredits } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', user.id)
        .single()

      const newCredits = (currentCredits?.credits || 0) + creditsToAdd

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
          amount: creditsToAdd,
          type: "received",
          description: `Credits from payment ${paymentId}`,
          metadata: {
            payment_id: paymentId,
            customer: paymentDetails.customer,
            product_cart: paymentDetails.product_cart
          }
        })

      if (logError) {
        console.error('Credit log error:', logError)
        throw logError
      }
    }

    console.log('Payment processing completed successfully')
    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("[PAYMENT_SUCCESS]", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    )
  }
} 