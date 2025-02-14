import { NextResponse } from 'next/server'
import { createClient } from "@/utils/supabase/server"

export async function GET(
  request: Request,
  { params }: { params: { paymentId: string } }
) {
  try {
    const { paymentId } = params
    const supabase = await createClient()

    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Fetch payment details from DodoPayments
    const response = await fetch(`https://test.dodopayments.com/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch payment details')
    }

    const payment = await response.json()

    // Generate PDF invoice using payment details
    const invoicePDF = await generateInvoicePDF({
      paymentId: payment.payment_id,
      businessId: payment.business_id,
      amount: payment.total_amount,
      currency: payment.currency,
      tax: payment.tax,
      customer: payment.customer,
      date: payment.created_at,
      items: payment.product_cart
    })

    // Return the PDF with appropriate headers
    return new NextResponse(invoicePDF, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${paymentId}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}

// Helper function to generate PDF invoice (implement using a PDF library)
async function generateInvoicePDF(data: any) {
  // Implement PDF generation using a library like pdfkit or jspdf
  // Return the PDF buffer
  // This is a placeholder
  return Buffer.from('PDF content')
} 