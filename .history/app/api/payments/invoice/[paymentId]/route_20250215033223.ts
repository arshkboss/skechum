import { NextResponse } from 'next/server'
import DodoPayments from 'dodopayments'

const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
})

export async function GET(
  request: Request,
  { params }: { params: { paymentId: string } }
) {
  try {
    const { paymentId } = params

    // Fetch invoice from Dodo Payments
    const invoice = await client.invoices.payments.retrieve(paymentId)
    
    // Get the invoice PDF
    const response = await fetch(invoice.invoice_url)
    const pdfBuffer = await response.arrayBuffer()

    // Return the PDF with appropriate headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${paymentId}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    )
  }
} 