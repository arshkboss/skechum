"use client"

import { Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { GenerationStatus } from "@/app/(authenticated)/create/types"
import { cn } from "@/lib/utils"

interface GenerateButtonProps {
  status: GenerationStatus
  isLoading: boolean
  isValid: boolean
  onClick: () => void
}

export function GenerateButton({ 
  status, 
  isLoading, 
  isValid, 
  onClick 
}: GenerateButtonProps) {
  return (
    <Button 
      disabled={
        status === 'generating' || 
        status === 'queued' || 
        isLoading || 
        !isValid
      }
      onClick={onClick}
      className={cn(
        "w-full",
        (isLoading || status === 'generating' || status === 'queued') && 
        "cursor-not-allowed opacity-70"
      )}
    >
      {status === 'generating' || status === 'queued' || isLoading ? (
        <>
          <LoadingSpinner className="mr-2 h-4 w-4" />
          {status === 'queued' ? 'In Queue...' : 
           isLoading ? 'Processing...' : 'Generating...'}
        </>
      ) : !isValid ? (
        <>
          Enter a prompt
          <Wand2 className="ml-2 h-4 w-4 opacity-50" />
        </>
      ) : (
        <>
          Generate Image
          <Wand2 className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  )
} 