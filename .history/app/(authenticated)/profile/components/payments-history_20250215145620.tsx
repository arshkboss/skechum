"use client"

import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"

interface Payment {
  id: string
  payment_id: string
  status: "succeeded" | "pending" | "failed"
  amount: number
  currency: string
  created_at: string
  payment_method: string
  customer_name: string
  plan_name: string
  plan_credits: number
  plan_details: {
    product_id: string
    description: string
    metadata: Record<string, any>
  }
}

export function PaymentsHistory() {
  const [payments, setPayments] = useState<Payment[]>([])
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

  const formatAmount = (amount: number) => (amount / 100).toFixed(2)

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMM yyyy, h:mm a")
    } catch (error) {
      console.error('Date parsing error:', error)
      return 'Invalid date'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Payments</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage all payment transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Download Report
          </Button>
          <Button variant="outline" size="sm">
            Select Date Range
          </Button>
          <Button variant="outline" size="sm">
            Filters
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {format(new Date(payment.created_at), "PPp")}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={payment.status === "succeeded" ? "success" : "destructive"}
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{payment.plan_name}</span>
                    <span className="text-sm text-muted-foreground">
                      {payment.plan_details.description}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {payment.plan_credits} Credits
                  </Badge>
                </TableCell>
                <TableCell>
                  {payment.currency} {(payment.amount / 100).toFixed(2)}
                </TableCell>
                <TableCell className="uppercase">
                  {payment.payment_method}
                </TableCell>
                <TableCell>
                  {payment.payment_id}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {payments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No payments found</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">Page 1</span>
        <Button variant="outline" size="sm" disabled>
          Next
        </Button>
      </div>
    </div>
  )
}

