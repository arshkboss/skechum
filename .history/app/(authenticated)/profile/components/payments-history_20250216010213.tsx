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
    <div className="md:hidden space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {payments.map((payment) => {
          const { date, time } = formatDateTime(payment.created_at)
          return (
            <AccordionItem key={payment.id} value={payment.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-col w-full">
                  {/* Main Row */}
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={getStatusBadgeVariant(payment.status)}
                        className="capitalize px-2 py-0.5"
                      >
                        {payment.status}
                      </Badge>
                      <span className="font-medium">
                        {payment.currency} {(payment.amount / 100).toFixed(2)}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{date}</span>
                  </div>
                  
                  {/* Secondary Row */}
                  <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                    <div className="flex flex-col">
                      <span className="font-medium text-primary">{payment.plan_name}</span>
                      <Badge 
                        variant={payment.credits_added > 0 ? "success" : "secondary"}
                        className="mt-1"
                      >
                        {payment.credits_added} credits
                      </Badge>
                    </div>
                    <span>{time}</span>
                  </div>

                  {/* Error Message if failed */}
                  {payment.status === 'failed' && payment.plan_details?.error_message && (
                    <div className="text-xs text-destructive mt-2 text-left">
                      {payment.plan_details.error_message}
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="p-4 mt-2 bg-muted/50">
                  <div className="space-y-4">
                    {/* Transaction Details Section */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Transaction Details</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-muted-foreground">Payment Method</div>
                          <div className="font-medium uppercase">{payment.payment_method}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Transaction ID</div>
                          <div className="font-medium break-all">{payment.payment_id}</div>
                        </div>
                      </div>
                    </div>

                    {/* Plan Details Section */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Plan Details</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-muted-foreground">Plan Type</div>
                          <div className="font-medium">{payment.plan_name}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Plan Credits</div>
                          <div className="font-medium">{payment.plan_credits} credits</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Amount Paid</div>
                          <div className="font-medium">
                            {payment.currency} {(payment.amount / 100).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Credits Added</div>
                          <Badge variant={payment.credits_added > 0 ? "success" : "secondary"}>
                            {payment.credits_added} credits
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Customer Details Section */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Customer Details</h4>
                      <div className="text-sm">
                        <div className="text-muted-foreground">Customer Name</div>
                        <div className="font-medium">{payment.customer_name}</div>
                      </div>
                    </div>
                  </div>
                </Card>
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

