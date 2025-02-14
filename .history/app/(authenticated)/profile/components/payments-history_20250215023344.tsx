"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, AlertCircle } from "lucide-react"

// Define interfaces for payment data
interface PaymentHistory {
  id: string
  payment_id: string
  amount: number
  currency: string
  status: "succeeded" | "failed" | "pending"
  created_at: string
  payment_method: string
  credits_added: number
  metadata?: {
    plan_name?: string
    description?: string
  }
}

export default function PaymentsHistory() {
  const [payments, setPayments] = useState<PaymentHistory[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("/api/payments/history")
        const data = await response.json()
        setPayments(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load payment history"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {payments.length > 0 ? (
          payments.map((payment) => (
            <Card key={payment.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">
                    {payment.metadata?.plan_name || "Credit Purchase"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true })}
                  </p>
                </div>
                <Badge 
                  variant={payment.status === "succeeded" ? "success" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {payment.status === "succeeded" ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  {payment.status}
                </Badge>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <p>Payment ID: {payment.payment_id}</p>
                  <p>Credits Added: {payment.credits_added}</p>
                  {payment.metadata?.description && (
                    <p>{payment.metadata.description}</p>
                  )}
                </div>
                <p className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: payment.currency,
                  }).format(payment.amount)}
                </p>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No payment history available</p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

