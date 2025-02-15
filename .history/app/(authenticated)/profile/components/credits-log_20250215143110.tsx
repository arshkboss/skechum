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

  useEffect(() => {
    async function fetchLogs() {
      const { data, error } = await supabase
        .from('credit_logs')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setLogs(data)
      }
      setLoading(false)
    }

    fetchLogs()
  }, [])

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