import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

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

      // Calculate credits (1 credit per INR)
      const creditsToAdd = Math.floor(paymentDetails.total_amount / 100)

      // Insert payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          user_id: user.id,
          payment_id: paymentId,
          amount: paymentDetails.total_amount,
          currency: paymentDetails.currency,
          status: paymentDetails.status,
          credits_added: creditsToAdd,
          payment_method: paymentDetails.payment_method,
          customer_name: paymentDetails.customer.name,
          customer_email: paymentDetails.customer.email,
          business_id: paymentDetails.business_id,
          tax: paymentDetails.tax || 0,
          created_at: paymentDetails.created_at,
          updated_at: new Date().toISOString()
        }])

      if (paymentError) {
        console.error('Payment insert error:', paymentError)
        return NextResponse.json(
          { 
            success: false, 
            message: "Failed to save payment details",
            error: paymentError
          }, 
          { status: 500 }
        )
      }

      // Update user credits
      const { data: userCredits, error: creditsFetchError } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', user.id)
        .maybeSingle()

      if (creditsFetchError) {
        console.error('Error fetching credits:', creditsFetchError)
      }

      const newCredits = (userCredits?.credits || 0) + creditsToAdd

      const { error: creditError } = await supabase
        .from('user_credits')
        .upsert({
          user_id: user.id,
          credits: newCredits,
          updated_at: new Date().toISOString()
        })

      if (creditError) {
        console.error('Credit update error:', creditError)
        return NextResponse.json(
          { 
            success: false, 
            message: "Failed to update credits",
            error: creditError
          }, 
          { status: 500 }
        )
      }

      return NextResponse.json({ 
        success: true,
        message: "Payment processed successfully",
        credits_added: creditsToAdd,
        new_balance: newCredits,
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