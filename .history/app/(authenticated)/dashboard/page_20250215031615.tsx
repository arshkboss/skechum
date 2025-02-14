"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  useEffect(() => {
    const handlePaymentSuccess = async () => {
      const paymentId = searchParams.get('payment_id')
      const status = searchParams.get('status')
      
      if (paymentId && status) {
        try {
          console.log('Processing payment:', { paymentId, status })
          
          // Call our payment success API
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
          
          // Show success toast
          toast({
            title: "Payment Successful",
            description: "Your credits have been added to your account.",
            variant: "success"
          })
          
          // Redirect to profile page after successful processing
          router.push('/profile?payment=success')
        } catch (error) {
          console.error('Payment processing error:', error)
          
          // Show error toast
          toast({
            title: "Payment Processing Failed",
            description: error instanceof Error ? error.message : "Please try again later",
            variant: "destructive"
          })
          
          router.push('/profile?payment=error')
        }
      } else {
        router.push('/profile')
      }
    }

    handlePaymentSuccess()
  }, [searchParams, router, toast])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <LoadingSpinner className="h-8 w-8 mx-auto mb-4" />
        <p className="text-muted-foreground">Processing your payment...</p>
      </div>
    </div>
  )
} 