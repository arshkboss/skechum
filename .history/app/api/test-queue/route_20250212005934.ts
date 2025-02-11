import { fal } from "@fal-ai/client"
import { NextResponse } from "next/server"
import type { QueueStatus } from "@fal-ai/client"

interface Recraft20bInput {
  prompt: string
  image_size: string
  style: string
  colors: string[]
}

interface Recraft20bOutput {
  images: Array<{
    url: string
  }>
}

fal.config({
  credentials: process.env.FAL_KEY
})

export const maxDuration = 300 // Increased for queue handling

export async function POST(request: Request) {
  try {
    const { prompt, style = "vector_illustration/cartoon" } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing prompt" },
        { status: 400 }
      )
    }

    // Submit the request to the queue
    const { request_id } = await fal.queue.submit<Recraft20bInput, Recraft20bOutput>("fal-ai/recraft-20b", {
      input: {
        prompt,
        image_size: "square_hd",
        style,
        colors: []
      }
    })

    // Start polling for the result
    let attempts = 0
    const maxAttempts = 60 // 5 minutes maximum wait time with 5-second intervals

    while (attempts < maxAttempts) {
      attempts++

      // Check the status of the request
      const status = await fal.queue.status("fal-ai/recraft-20b", {
        requestId: request_id,
        logs: true
      })

      // Type guard to check the status
      if ('error' in status) {
        return NextResponse.json(
          { error: "Generation failed", details: status.error },
          { status: 500 }
        )
      }

      if (status.status === "COMPLETED") {
        // Get the final result
        const result = await fal.queue.result<Recraft20bOutput>("fal-ai/recraft-20b", {
          requestId: request_id
        })
        
        // Log the result structure
        console.log("Generation result:", result)
        
        if (!result.images?.[0]?.url) {
          throw new Error("No image URL in response")
        }
        
        // Return a properly structured response
        return NextResponse.json({
          data: {
            image_url: result.images[0].url,
            request_id
          }
        })
      }

      // Wait 5 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 5000))
    }

    return NextResponse.json(
      { error: "Generation timed out after 5 minutes" },
      { status: 504 }
    )

  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    )
  }
} 