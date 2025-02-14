"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, ShieldCheck, ArrowRight, CreditCard } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function TransactionSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')
  const isValidAccess = Boolean(paymentId && status)

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
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 px-4">
        <div className="container max-w-md mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
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
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 px-4">
      <div className="container max-w-lg mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <LoadingSpinner className="h-12 w-12 mb-6" />
              <h1 className="text-2xl font-bold mb-2">Processing Your Payment</h1>
              <p className="text-muted-foreground mb-8">
                Please wait while we verify and process your transaction...
              </p>

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
              </div>

              <div className="w-full p-4 bg-blue-500/10 rounded-lg mb-6">
                <p className="text-sm text-blue-500">
                  Your credits will be added to your account automatically once the payment is processed.
                </p>
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          <p>Having issues? Contact our support team</p>
          <p className="mt-1">support@skechum.com</p>
        </motion.div>
      </div>
    </div>
  )
} 