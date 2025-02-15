"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

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
  credits_added: number
}

export function PaymentsHistory() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchPayments() {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setPayments(data)
      }
      setLoading(false)
    }

    fetchPayments()

    // Set up real-time subscription for payments
    const channel = supabase
      .channel('payment_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments'
        },
        () => {
          fetchPayments()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'success'
      case 'failed':
        return 'destructive'
      case 'pending':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  if (loading) {
    return <div>Loading payments...</div>
  }

  return (
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
            <TableHead>Payment ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{format(new Date(payment.created_at), "PPp")}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(payment.status)}>
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{payment.plan_name}</span>
                  <span className="text-sm text-muted-foreground">
                    {payment.plan_credits} credits
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={payment.credits_added > 0 ? "success" : "secondary"}>
                  {payment.credits_added} added
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
    </div>
  )
}

