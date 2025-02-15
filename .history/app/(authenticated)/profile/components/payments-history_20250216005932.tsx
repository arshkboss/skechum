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
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden lg:table-cell">Payment Method</TableHead>
              <TableHead className="hidden xl:table-cell">Payment ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{format(new Date(payment.created_at), "PPp")}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant={getStatusBadgeVariant(payment.status)}>
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
                  <span className="font-medium">
                    {payment.currency} {(payment.amount / 100).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell uppercase">
                  {payment.payment_method}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {payment.payment_id}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )

  // Mobile view (below md)
  const MobileView = () => (
    <div className="md:hidden space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {payments.map((payment) => (
          <AccordionItem key={payment.id} value={payment.id}>
            <AccordionTrigger>
              <div className="flex justify-between items-center w-full pr-4">
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(payment.status)}>
                    {payment.status}
                  </Badge>
                  <span className="font-medium">
                    {payment.currency} {(payment.amount / 100).toFixed(2)}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(payment.created_at), "PP")}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Plan</div>
                    <div className="font-medium">{payment.plan_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.plan_credits} credits
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Credits Added</div>
                    <Badge variant={payment.credits_added > 0 ? "success" : "secondary"}>
                      {payment.credits_added} added
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Payment Method</div>
                    <div className="uppercase">{payment.payment_method}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Payment ID</div>
                    <div className="text-sm break-all">{payment.payment_id}</div>
                  </div>
                </div>
                {payment.status === 'failed' && payment.plan_details?.error_message && (
                  <div className="text-xs text-destructive mt-2">
                    Error: {payment.plan_details.error_message}
                  </div>
                )}
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
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

