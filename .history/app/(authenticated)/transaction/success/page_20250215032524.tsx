"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function TransactionSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // Check if this is a valid payment redirect
  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')
  const isValidAccess = Boolean(paymentId && status)

  useEffect(() => {
    if (!isValidAccess) {
      return // Don't process anything if direct access
    }

    const handlePaymentSuccess = async () => {
      try {
        console.log('Processing payment:', { paymentId, status })
        
        const response = await fetch(`/api/payments/success?payment_id=${paymentId}&status=${status}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          console.error('Payment processing error:', data)
          throw new Error(data.message || 'Payment processing failed')
        }
        
        toast({
          title: "Payment Successful",
          description: "Your credits have been added to your account.",
          variant: "success"
        })
        
        router.push('/profile?payment=success')
      } catch (error) {
        console.error('Payment processing error:', error)
        
        toast({
          title: "Payment Processing Failed",
          description: error instanceof Error ? error.message : "Please try again later",
          variant: "destructive"
        })
        
        router.push('/profile?payment=error')
      }
    }

    handlePaymentSuccess()
  }, [paymentId, status, router, toast, isValidAccess])

  if (!isValidAccess) {
    return (
      <div className="container max-w-md mx-auto mt-20 p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Invalid Access</AlertTitle>
          <AlertDescription>
            This page can only be accessed after a successful payment transaction.
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button
            onClick={() => router.push('/pricing')}
            variant="outline"
          >
            View Pricing Plans
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <LoadingSpinner className="h-8 w-8 mx-auto mb-4" />
        <p className="text-muted-foreground">Processing your payment...</p>
      </div>
    </div>
  )
} 