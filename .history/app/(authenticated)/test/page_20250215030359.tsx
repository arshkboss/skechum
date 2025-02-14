"use client"

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"

interface PaymentDetails {
  payment_id: string
  business_id: string
  status: string
  total_amount: number
  currency: string
  payment_method: string
  customer: {
    customer_id: string
    name: string
    email: string
  }
  product_cart: Array<{
    product_id: string
    quantity: number
  }>
  [key: string]: any // For other fields
}

export default function TestPage() {
  const [paymentId, setPaymentId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const { toast } = useToast()

  const testDodoApi = async () => {
    setLoading(true)
    setError(null)
    setPaymentDetails(null)

    try {
      const response = await fetch(`/api/test-dodo?payment_id=${paymentId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch payment details')
      }

      setPaymentDetails(data)
      toast({
        title: "Success",
        description: "Payment details fetched successfully",
        variant: "success"
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">DodoPayments API Test</h1>

      <Card className="p-6 mb-8">
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Enter payment ID"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={testDodoApi}
            disabled={loading || !paymentId}
          >
            {loading ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Testing...
              </>
            ) : (
              'Test API'
            )}
          </Button>
        </div>

        {error && (
          <div className="p-4 mb-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}

        {paymentDetails && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Payment Details:</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Basic Info</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Payment ID:</span> {paymentDetails.payment_id}</p>
                  <p><span className="text-muted-foreground">Status:</span> {paymentDetails.status}</p>
                  <p><span className="text-muted-foreground">Amount:</span> {paymentDetails.total_amount/100} {paymentDetails.currency}</p>
                  <p><span className="text-muted-foreground">Method:</span> {paymentDetails.payment_method}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Customer Info</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {paymentDetails.customer.name}</p>
                  <p><span className="text-muted-foreground">Email:</span> {paymentDetails.customer.email}</p>
                  <p><span className="text-muted-foreground">ID:</span> {paymentDetails.customer.customer_id}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Raw Response:</h3>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[400px] text-xs">
                {JSON.stringify(paymentDetails, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
} 