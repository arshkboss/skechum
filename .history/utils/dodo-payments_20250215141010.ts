const DODO_API_URL = 'https://test.dodopayments.com'

export async function getPaymentDetails(paymentId: string) {
  try {
    console.log('Fetching payment details for:', paymentId)
    
    // First try the /v1/payments endpoint
    let response = await fetch(`${DODO_API_URL}/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })


    if (!response.ok) {
      const errorText = await response.text()
      console.error('DodoPayments API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        headers: Object.fromEntries(response.headers.entries())
      })
      throw new Error(`Payment verification failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Payment details received:', data)
    return data
  } catch (error) {
    console.error('Error fetching payment details:', error)
    throw error
  }
} 