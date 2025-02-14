"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CreditLog {
  id: string
  amount: number
  type: "spent" | "received"
  description: string
  created_at: string
}

export function CreditsLog() {
  const [logs, setLogs] = useState<CreditLog[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // TODO: Implement API call to fetch credit logs
        const response = await fetch("/api/credits/logs")
        const data = await response.json()
        setLogs(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load credit logs"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
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
        {logs.length > 0 ? (
          logs.map((log) => (
            <Card key={log.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{log.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                  </p>
                </div>
                <Badge variant={log.type === "received" ? "success" : "secondary"}>
                  {log.type === "received" ? "+" : "-"}{log.amount} credits
                </Badge>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No credit history available</p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
} 