"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const handlePaymentSuccess = async () => {
      const paymentId = searchParams.get('payment_id')
      const status = searchParams.get('status')
      
      if (paymentId && status) {
        try {
          // Call our payment success API
          const response = await fetch(`/api/payments/success?payment_id=${paymentId}&status=${status}`, {
            method: 'POST' // Change to POST for better security
          })
          
          if (!response.ok) throw new Error('Payment processing failed')
          
          // Redirect to profile page after successful processing
          router.push('/profile?payment=success')
        } catch (error) {
          console.error('Payment processing error:', error)
          router.push('/profile?payment=error')
        }
      }
    }

    handlePaymentSuccess()
  }, [searchParams, router])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <LoadingSpinner className="h-8 w-8 mx-auto mb-4" />
        <p className="text-muted-foreground">Processing your payment...</p>
      </div>
    </div>
  )
} 