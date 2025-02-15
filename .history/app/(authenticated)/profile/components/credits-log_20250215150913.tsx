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
import { useUser } from "@/hooks/use-user"

interface CreditLog {
  id: string
  amount: number
  type: string
  description: string
  previous_balance: number
  new_balance: number
  created_at: string
}

export default function CreditsLog() {
  const [logs, setLogs] = useState<CreditLog[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { user, refreshCredits } = useUser()

  useEffect(() => {
    if (!user?.id) return

    fetchLogs()

    const channel = supabase
      .channel('credit_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'credit_logs',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Credit log changed:', payload)
          fetchLogs()
          refreshCredits()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  const fetchLogs = async () => {
    if (!user?.id) return

    const { data, error } = await supabase
      .from('credit_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setLogs(data)
    }
    setLoading(false)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Previous Balance</TableHead>
            <TableHead>New Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{format(new Date(log.created_at), "PPp")}</TableCell>
              <TableCell>
                <Badge variant={log.type === 'purchase' ? 'success' : 'default'}>
                  {log.type}
                </Badge>
              </TableCell>
              <TableCell>{log.amount}</TableCell>
              <TableCell>{log.description}</TableCell>
              <TableCell>{log.previous_balance}</TableCell>
              <TableCell>{log.new_balance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}  