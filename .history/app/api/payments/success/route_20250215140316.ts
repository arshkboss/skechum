import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('payment_id')
    const status = searchParams.get('status')
    
    if (!paymentId || !status) {
      return NextResponse.json({ message: "Missing payment details" }, { status: 400 })
    }

    // Fetch payment details from Dodo Payments with correct API URL
    const response = await fetch(`https://test.dodopayments.com/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('Dodo API Error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })
      throw new Error(`Payment verification failed: ${response.status}`)
    }

    const paymentDetails = await response.json()
    
    // Verify payment status
    if (paymentDetails.status !== 'succeeded') {
      return NextResponse.json({ 
        message: "Payment not successful",
        status: paymentDetails.status 
      }, { status: 400 })
    }

    // Check if payment already exists
    const { data: existingPayment, error: checkError } = await supabase
      .from('payments')
      .select()
      .eq('payment_id', paymentId)
      .maybeSingle() // Use maybeSingle instead of single to avoid error

    if (checkError) {
      console.error('Error checking payment:', checkError)
    }

    if (existingPayment) {
      return NextResponse.json({ status: "already_processed" })
    }

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
        tax: paymentDetails.tax,
        business_id: paymentDetails.business_id,
        created_at: paymentDetails.created_at // Use payment's creation time
      }])

    if (paymentError) {
      console.error('Payment insert error:', paymentError)
      throw paymentError
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
      throw creditError
    }

    // Log credit transaction
    const { error: logError } = await supabase
      .from('credit_logs')
      .insert([{
        user_id: user.id,
        amount: creditsToAdd,
        type: 'purchase',
        description: `Credits purchased - Payment ID: ${paymentId}`,
        created_at: new Date().toISOString()
      }])

    if (logError) {
      console.error('Credit log error:', logError)
      throw logError
    }

    return NextResponse.json({ 
      status: "success",
      credits_added: creditsToAdd,
      new_balance: newCredits
    })

  } catch (error) {
    console.error('Payment processing error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Payment processing failed" },
      { status: 500 }
    )
  }
} 