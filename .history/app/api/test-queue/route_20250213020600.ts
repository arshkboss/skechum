import { fal } from "@fal-ai/client"
import { NextResponse } from "next/server"


fal.config({
  credentials: process.env.FAL_KEY
})

export const maxDuration = 60 // Increased for queue handling

// Define the model endpoint and its types
declare module "@fal-ai/client" {
  interface EndpointTypes {
    "fal-ai/recraft-20b": {
      input: {
        prompt: string
        image_size: string
        style: string
        colors: string[]
      }
      output: {
        images: Array<{
          url: string
        }>
      }
    }
  }
}

export async function POST(request: Request) {
  try {
    // Log incoming request
    console.log("Incoming request body:", await request.clone().text())

    const { prompt, style = "vector_illustration/cartoon" } = await request.json()

    if (!prompt?.trim()) {
      console.log("Missing or empty prompt")
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      )
    }

    try {
      // 1. Submit to queue
      console.log("Submitting to queue with:", { prompt, style })
      const queueResponse = await fal.queue.submit(
        "fal-ai/recraft-20b",
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

      // 2. Wait for completion using subscribeToStatus
      const status = await fal.queue.subscribeToStatus(
        "fal-ai/recraft-20b",
        {
          requestId: queueResponse.request_id,
          mode: "polling", 
          
          timeout: 120000, // 2 minute timeout
          onQueueUpdate: (update) => {
            console.log("Queue status update:", update)
          }
        }
      )

      console.log("Final status:", status)

      if (status.status !== "COMPLETED") {
        throw new Error("Generation failed or timed out")
      }

      // 3. Get the final result
      const result = await fal.queue.result(
        "fal-ai/recraft-20b",
        {
          requestId: queueResponse.request_id
        }
      )

      console.log("Generation result:", result)

      // Validate result
      if (!result?.data?.images?.[0]?.url) {
        console.error("Invalid result structure:", result)
        return NextResponse.json(
          { error: "Invalid response from image generation service" },
          { status: 500 }
        )
      }

      // Return properly structured response
      const response = {
        data: {
          image_url: result.data.images[0].url,
          request_id: queueResponse.request_id
        }
      }
      console.log("Sending response:", response)
      return NextResponse.json(response)

    } catch (falError) {
      console.error("Fal AI error:", falError)
      return NextResponse.json(
        { 
          error: falError instanceof Error ? falError.message : "Image generation service error",
          details: falError
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Request parsing error:", error)
    return NextResponse.json(
      { 
        error: "Invalid request format",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 400 }
    )
  }
} 