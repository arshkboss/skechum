import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { pricingPlans } from "@/constants/pricing"

// Create a map of product IDs to plan details for faster lookup
const PLAN_DETAILS = pricingPlans.reduce((acc, plan) => ({
  ...acc,
  [plan.productId]: {
    name: plan.name,
    credits: plan.credits,
    description: plan.description
  }
}), {} as Record<string, { name: string; credits: number; description: string }>)

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" }, 
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('payment_id')
    const status = searchParams.get('status')
    
    if (!paymentId || !status) {
      return NextResponse.json(
        { success: false, message: "Missing payment details" }, 
        { status: 400 }
      )
    }

    console.log('Processing payment:', { paymentId, status, userId: user.id })

    // Fetch payment details from Dodo Payments
    try {
      const response = await fetch(`https://test.dodopayments.com/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Dodo API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          headers: Object.fromEntries(response.headers.entries())
        })
        return NextResponse.json(
          { 
            success: false, 
            message: `Payment verification failed: ${response.status} ${response.statusText}`,
            details: errorText
          }, 
          { status: response.status }
        )
      }

      const paymentDetails = await response.json()
      console.log('Payment details:', paymentDetails)

      // Get plan details from the product cart
      const productId = paymentDetails.product_cart[0]?.product_id
      const planInfo = PLAN_DETAILS[productId]

      if (!planInfo) {
        console.error('Unknown product ID:', productId)
        return NextResponse.json(
          { 
            success: false, 
            message: "Invalid product plan",
            details: `Unknown product ID: ${productId}`
          }, 
          { status: 400 }
        )
      }

      // Always insert payment record, regardless of status
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          user_id: user.id,
          payment_id: paymentId,
          amount: paymentDetails.total_amount,
          currency: paymentDetails.currency,
          status: paymentDetails.status,
          credits_added: paymentDetails.status === 'succeeded' ? planInfo.credits : 0,
          payment_method: paymentDetails.payment_method,
          customer_name: paymentDetails.customer.name,
          customer_email: paymentDetails.customer.email,
          business_id: paymentDetails.business_id,
          tax: paymentDetails.tax || 0,
          created_at: paymentDetails.created_at,
          updated_at: new Date().toISOString(),
          plan_name: planInfo.name,
          plan_credits: planInfo.credits,
          plan_details: {
            product_id: productId,
            description: planInfo.description,
            metadata: paymentDetails.metadata || {},
            error_message: paymentDetails.error_message || null
          }
        }])

      if (paymentError) {
        console.error('Payment insert error:', paymentError)
        return NextResponse.json(
          { success: false, message: "Failed to save payment details", error: paymentError }, 
          { status: 500 }
        )
      }

      // Check payment status after recording the payment
      if (paymentDetails.status !== 'succeeded') {
        return NextResponse.json(
          { 
            success: false, 
            message: "Payment was not successful",
            details: `Payment status: ${paymentDetails.status}`,
            error_message: paymentDetails.error_message,
            payment_details: paymentDetails
          }, 
          { status: 400 }
        )
      }

      // Only proceed with credit updates if payment was successful
      const { data: updatedCredits, error: creditError } = await supabase
        .rpc('update_user_credits', {
          p_user_id: user.id,
          p_credits_to_add: planInfo.credits
        })

      if (creditError) {
        console.error('Credit update error:', creditError)
        return NextResponse.json(
          { success: false, message: "Failed to update credits", error: creditError }, 
          { status: 500 }
        )
      }

      // Log the credit transaction only for successful payments
      const { error: logError } = await supabase
        .from('credit_logs')
        .insert([{
          user_id: user.id,
          amount: planInfo.credits,
          type: 'purchase',
          description: `Credits purchased via payment ${paymentId}`,
          payment_id: paymentId,
          previous_balance: updatedCredits.old_credits,
          new_balance: updatedCredits.new_credits,
          created_at: new Date().toISOString()
        }])

      if (logError) {
        console.error('Credit log error:', logError)
      }

      return NextResponse.json({ 
        success: true,
        message: "Payment processed successfully",
        credits_added: planInfo.credits,
        new_balance: updatedCredits.new_credits,
        payment_details: paymentDetails
      })

    } catch (error) {
      console.error('Payment processing error:', error)
      return NextResponse.json(
        { 
          success: false, 
          message: error instanceof Error ? error.message : "Payment processing failed",
          error: error
        }, 
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    )
  }
} 