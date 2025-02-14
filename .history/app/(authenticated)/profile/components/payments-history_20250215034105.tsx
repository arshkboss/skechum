"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import {
  Download,
  Receipt,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import React from "react"

interface PaymentDetails {
  id: string
  payment_id: string
  business_id: string
  amount: number
  currency: string
  status: "succeeded" | "pending" | "failed"
  created_at: string
  payment_method: string
  payment_method_type: string | null
  credits_added: number
  customer: {
    customer_id: string
    name: string
    email: string
  }
  product_cart: Array<{
    product_id: string
    quantity: number
  }>
  tax: number
  metadata: Record<string, any>
}

export function PaymentsHistory() {
  const [payments, setPayments] = useState<PaymentDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null)
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
    }
  }

  const formatAmount = (amount: number) => (amount / 100).toFixed(2)

  return (
    <Card className="w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Payment History</h2>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage your payment transactions
            </p>
          </div>
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
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <React.Fragment key={payment.id}>
                  <Collapsible>
                    <TableRow>
                      <TableCell className="font-medium">
                        {format(new Date(payment.created_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {payment.payment_id}
                      </TableCell>
                      <TableCell>
                        {payment.currency} {formatAmount(payment.amount)}
                      </TableCell>
                      <TableCell>{payment.credits_added} credits</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadInvoice(payment.payment_id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Invoice
                        </Button>
                      </TableCell>
                      <TableCell>
                        <CollapsibleTrigger
                          onClick={() => setExpandedPayment(
                            expandedPayment === payment.id ? null : payment.id
                          )}
                        >
                          <ChevronDown className={cn(
                            "h-4 w-4 transition-transform cursor-pointer",
                            expandedPayment === payment.id && "transform rotate-180"
                          )} />
                        </CollapsibleTrigger>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                        <CollapsibleContent>
                          {expandedPayment === payment.id && (
                            <div className="bg-muted/50 p-4 space-y-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Customer</h4>
                                  <p className="text-sm">{payment.customer.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {payment.customer.email}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Payment Method</h4>
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    <span className="text-sm capitalize">
                                      {payment.payment_method}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Tax</h4>
                                  <p className="text-sm">
                                    {payment.currency} {formatAmount(payment.tax)}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Business ID</h4>
                                  <p className="text-sm font-mono">
                                    {payment.business_id}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </CollapsibleContent>
                      </TableCell>
                    </TableRow>
                  </Collapsible>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>

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

