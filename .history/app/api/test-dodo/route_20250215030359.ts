import { NextResponse } from "next/server"
import { headers } from 'next/headers'

const DODO_API_URL = 'https://test.dodopayments.com'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('payment_id')

    if (!paymentId) {
      return NextResponse.json(
        { message: "Payment ID is required" },
        { status: 400 }
      )
    }

    console.log('Fetching payment details for:', paymentId)
    console.log('Using API Key:', process.env.DODO_PAYMENTS_API_KEY)

    const response = await fetch(`${DODO_API_URL}/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DodoPayments API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        headers: Object.fromEntries(response.headers.entries())
      })
      
      return NextResponse.json(
        { 
          message: `API Error: ${response.status} ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Payment details received:', data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in test-dodo route:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    )
  }
} 