"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, ShieldCheck, CreditCard } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

// Add interface for API response
interface PaymentResponse {
  success: boolean
  message: string
  credits_added?: number
  new_balance?: number
  payment_details?: any
  error?: any
  details?: string
}

export default function TransactionSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [processing, setProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any | null>(null)
  
  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')
  const isValidAccess = Boolean(paymentId && status)

  // Prevent back navigation after successful payment
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    window.onpopstate = function() {
      window.history.pushState(null, '', window.location.href)
    }

    return () => {
      window.onpopstate = null
    }
  }, [])

  useEffect(() => {
    if (!isValidAccess) return

    const handlePaymentSuccess = async () => {
      try {
        console.log('Processing payment:', { paymentId, status })
        
        const response = await fetch(`/api/payments/success?payment_id=${paymentId}&status=${status}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        const data: PaymentResponse = await response.json()
        console.log('Payment response:', data)
        
        if (!response.ok || !data.success) {
          const errorMessage = data.message || data.details || 'Payment processing failed'
          console.error('Payment processing error:', data)
          setError(errorMessage)
          toast({
            title: "Payment Processing Failed",
            description: errorMessage,
            variant: "destructive"
          })
        } else {
          setResult(data)
          toast({
            title: "Payment Successful",
            description: `Added ${data.credits_added} credits to your account.`,
            variant: "success"
          })
          // Redirect to profile payments tab after successful payment
          router.push('/profile?tab=payments')
          // Prevent going back to this page
          router.replace('/profile?tab=payments')
        }
      } catch (error) {
        console.error('Payment processing error:', error)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Please try again later",
          variant: "destructive"
        })
      } finally {
        setProcessing(false)
      }
    }

    handlePaymentSuccess()
  }, [paymentId, status, toast, router, isValidAccess])

  if (!isValidAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 px-4">
        <div className="container max-w-md mx-auto pt-20">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Invalid Access</h1>
              <p className="text-muted-foreground mb-6">
                This page can only be accessed after a successful payment transaction.
              </p>
              <Button
                onClick={() => router.push('/pricing')}
                className="w-full"
              >
                View Pricing Plans
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 px-4">
      <div className="container max-w-lg mx-auto pt-20">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            {processing ? (
              <>
                <LoadingSpinner className="h-12 w-12 mb-6" />
                <h1 className="text-2xl font-bold mb-2">Processing Your Payment</h1>
                <p className="text-muted-foreground mb-8">
                  Please wait while we verify and process your transaction...
                </p>
              </>
            ) : error ? (
              <>
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Payment Processing Failed</h1>
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Payment Successful</h1>
                <p className="text-green-500 mb-6">
                  {result?.credits_added} credits have been added to your account
                </p>
              </>
            )}

            <div className="w-full space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span className="text-sm">Payment ID</span>
                </div>
                <span className="text-sm font-mono">{paymentId}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span className="text-sm">Status</span>
                </div>
                <span className="text-sm font-medium text-green-500">{status}</span>
              </div>
              {result && (
                <pre className="p-4 bg-muted/50 rounded-lg text-left text-xs overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <Button
                variant="outline"
                onClick={() => router.push('/profile')}
              >
                View Profile
              </Button>
              <Button
                onClick={() => router.push('/create')}
              >
                Start Creating
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Having issues? Contact our support team</p>
          <p className="mt-1">support@skechum.com</p>
        </div>
      </div>
    </div>
  )
} 