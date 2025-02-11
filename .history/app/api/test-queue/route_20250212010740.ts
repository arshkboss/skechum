import { fal } from "@fal-ai/client"
import { NextResponse } from "next/server"

fal.config({
  credentials: process.env.FAL_KEY
})

export const maxDuration = 300 // Increased for queue handling

// Define input and output types according to the API
interface RecraftInput {
  prompt: string
  image_size: string
  style: string
  colors: string[]
}

interface RecraftOutput {
  images: Array<{ url: string }>
}

export async function POST(request: Request) {
  try {
    const { prompt, style = "vector_illustration/cartoon" } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing prompt" },
        { status: 400 }
      )
    }

    // Submit the request to the queue and wait for result
    const queueResponse = await fal.queue.submit(
      "fal-ai/recraft-20b",
      {
        input: {
          prompt,
          image_size: "square_hd",
          style,
          colors: []
        },
        pollInterval: 1000, // Poll every second
        maxRetries: 300, // Maximum retries
      }
    )

    // Wait for the result using subscribeToStatus
    const result = await fal.queue.subscribeToStatus(
      "fal-ai/recraft-20b",
      {
        requestId: queueResponse.request_id,
        pollInterval: 1000,
        logs: true
      }
    )

    console.log("Generation result:", result)

    // Return a properly structured response
    return NextResponse.json({
      data: {
        image_url: result.output.images[0].url,
        request_id: result.request_id
      }
    })

  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    )
  }
} 