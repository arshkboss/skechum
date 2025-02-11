import { fal } from "@fal-ai/client"
import { NextResponse } from "next/server"

fal.config({
  credentials: process.env.FAL_KEY
})

export const maxDuration = 300 // Increased for queue handling

export async function POST(request: Request) {
  try {
    const { prompt, style = "vector_illustration/doodle_line_art" } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing prompt" },
        { status: 400 }
      )
    }

    // Submit the request to the queue
    const { request_id } = await fal.queue.submit("fal-ai/recraft-20b", {
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

      if (status.status === "COMPLETED") {
        // Get the final result
        const result = await fal.queue.result("fal-ai/recraft-20b", {
          requestId: request_id
        })
        return NextResponse.json(result)
      }

      if (status.status === "FAILED") {
        return NextResponse.json(
          { error: "Generation failed", details: status.error },
          { status: 500 }
        )
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