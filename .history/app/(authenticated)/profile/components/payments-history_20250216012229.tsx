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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useUser } from "@/hooks/use-user"


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
  plan_details: {
    error_message?: string | null
  }
}

// Add this helper function for better date formatting
const formatDateTime = (date: string) => {
  const d = new Date(date)
  return {
    date: format(d, "MMM dd, yyyy"),
    time: format(d, "hh:mm a"),
  }
}

export function PaymentsHistory() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const getStatusBadgeVariant = (status: string): "success" | "destructive" | "secondary" | "default" => {
    switch (status) {
      case 'succeeded':
        return 'success'
      case 'failed':
        return 'destructive'
      case 'pending':
        return 'secondary'
      default:
        return 'default'
    }
  }

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

  if (loading) {
    return <div className="flex justify-center p-4">Loading payments...</div>
  }

  // Desktop view (md and above)
  const DesktopView = () => (
    <div className="hidden md:block">
      <ScrollArea className="rounded-md border h-[600px]">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[180px]">Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan Details</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => {
              const { date, time } = formatDateTime(payment.created_at)
              return (
                <TableRow key={payment.id} className="group hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium">{date}</div>
                    <div className="text-sm text-muted-foreground">{time}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={getStatusBadgeVariant(payment.status)} className="w-fit">
                        {payment.status}
                      </Badge>
                      {payment.status === 'failed' && payment.plan_details?.error_message && (
                        <span className="text-xs text-destructive">
                          {payment.plan_details.error_message}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{payment.plan_name}</span>
                      <span className="text-sm text-muted-foreground">
                        via {payment.payment_method}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={payment.credits_added > 0 ? "success" : "secondary"}>
                        {payment.credits_added} added
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        of {payment.plan_credits} total
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">
                      {payment.currency} {(payment.amount / 100).toFixed(2)}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )

  // Mobile view (below md)
  const MobileView = () => (
    <div className="md:hidden">
      <Accordion type="single" collapsible className="w-full space-y-2">
        {payments.map((payment) => {
          const { date, time } = formatDateTime(payment.created_at)
          return (
            <AccordionItem 
              key={payment.id} 
              value={payment.id}
              className="border rounded-lg bg-card overflow-hidden"
            >
              <AccordionTrigger className="hover:no-underline px-4 py-3">
                <div className="flex flex-col w-full">
                  {/* Top Row - Date & Time */}
                  <div className="flex justify-end text-sm text-muted-foreground bg-muted/50">
                    <span>{date} · {time}</span>
                  </div>

                  {/* Main Content Row */}
                  <div className="mt-2 space-y-2">
                    {/* Plan Name */}
                    <div className="text-base font-medium text-left">
                      {payment.plan_name}
                    </div>
                    
                    {/* Amount */}
                    <div className="text-lg font-semibold text-left">
                      {payment.currency} {(payment.amount / 100).toFixed(2)}
                    </div>

                    {/* Credits and Status */}
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={payment.credits_added > 0 ? "success" : "secondary"}
                        className="px-2 py-0.5"
                      >
                        {payment.credits_added} credits
                      </Badge>

                      <Badge 
                        variant={getStatusBadgeVariant(payment.status)}
                        className="capitalize px-2 py-0.5"
                      >
                        {payment.status}
                      </Badge>
                    </div>

                    {/* Error Message if failed */}
                    {payment.status === 'failed' && payment.plan_details?.error_message && (
                      <div className="text-xs text-destructive">
                        {payment.plan_details.error_message}
                      </div>
                    )}
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="px-4 py-4 bg-muted/30 border-t">
                  <div className="space-y-4">
                    {/* Transaction Details */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Payment Method</div>
                        <div className="font-medium mt-0.5 uppercase">{payment.payment_method}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Plan Credits</div>
                        <div className="font-medium mt-0.5">{payment.plan_credits}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm text-muted-foreground">Transaction ID</div>
                        <div className="font-medium mt-0.5 text-xs font-mono break-all">
                          {payment.payment_id}
                        </div>
                      </div>
                      {payment.customer_name && (
                        <div className="col-span-2">
                          <div className="text-sm text-muted-foreground">Customer</div>
                          <div className="font-medium mt-0.5">{payment.customer_name}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )

  return (
    <div className="w-full space-y-4">
      <DesktopView />
      <MobileView />
    </div>
  )
}

