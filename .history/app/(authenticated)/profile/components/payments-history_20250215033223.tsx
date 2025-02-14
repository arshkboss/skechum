"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, AlertCircle, Download, Receipt, CreditCard, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from 'date-fns'

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

export function PaymentsHistory() {
  const [payments, setPayments] = useState<PaymentHistory[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

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

  // Function to get status badge
  const getStatusBadge = (status: "succeeded" | "failed" | "pending") => {
    const statusConfig = {
      succeeded: { variant: 'success', icon: CheckCircle2, label: 'Succeeded' },
      pending: { variant: 'warning', icon: Clock, label: 'Pending' },
      failed: { variant: 'destructive', icon: AlertCircle, label: 'Failed' }
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  // Function to format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  // Function to download invoice
  const handleDownloadInvoice = async (paymentId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/payments/invoice/${paymentId}`)
      
      if (!response.ok) throw new Error('Failed to download invoice')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${paymentId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download invoice. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Payment History</h2>
          <Button variant="outline" size="sm">
            <Receipt className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {format(new Date(payment.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>{payment.metadata?.plan_name || "Credit Purchase"}</TableCell>
                  <TableCell>
                    {formatCurrency(payment.amount, payment.currency)}
                  </TableCell>
                  <TableCell>{payment.credits_added} credits</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      {payment.payment_method}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadInvoice(payment.id)}
                      disabled={isLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Empty state */}
        {payments.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No payments yet</h3>
            <p className="text-muted-foreground">
              When you make a payment, it will appear here.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

