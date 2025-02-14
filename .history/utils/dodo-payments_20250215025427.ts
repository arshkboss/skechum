const DODO_API_URL = 'https://api.dodopayments.com/v1'

export async function getPaymentDetails(paymentId: string) {
  try {
    const response = await fetch(`${DODO_API_URL}/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch payment details')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching payment details:', error)
    throw error
  }
} 