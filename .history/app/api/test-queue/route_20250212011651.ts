import { fal } from "@fal-ai/client"
import { NextResponse } from "next/server"
import type { QueueStatus, Result } from "@fal-ai/client"

fal.config({
  credentials: process.env.FAL_KEY
})

export const maxDuration = 300 // Increased for queue handling

// Define the Recraft model endpoint type
type Recraft20bEndpoint = "fal-ai/recraft-20b"

// Define the expected output type for the Recraft model
type Recraft20bOutput = {
  images: Array<{
    url: string
  }>
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

    // 1. Submit to queue
    const queueResponse = await fal.queue.submit(
      "fal-ai/recraft-20b" as Recraft20bEndpoint,
      {
        input: {
          prompt,
          image_size: "square_hd",
          style,
          colors: []
        }
      }
    )

    console.log("Queue response:", queueResponse)

    // 2. Get the final result using queue.result
    const result = await fal.queue.result<Recraft20bOutput>(
      "fal-ai/recraft-20b" as Recraft20bEndpoint,
      {
        requestId: queueResponse.request_id
      }
    )

    console.log("Generation result:", result)

    // Validate result
    if (!result.data?.images?.[0]?.url) {
      throw new Error("No image generated")
    }

    // Return properly structured response
    return NextResponse.json({
      data: {
        image_url: result.data.images[0].url,
        request_id: queueResponse.request_id
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