import { fal } from "@fal-ai/client"
import { NextResponse } from "next/server"

fal.config({
  credentials: process.env.FAL_KEY
})

export async function POST(request: Request) {
  try {
    const { prompt, size } = await request.json()

    if (!prompt || !size) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const imageSize = size === 'square' ? 'square_hd' : 
                     size === 'portrait' ? 'portrait_16_9' : 'landscape_16_9'

    const result = await fal.subscribe("fal-ai/recraft-v3", {
      input: {
        prompt,
        image_size: imageSize,
        style: "vector_illustration/line_art",
        colors: []
      },
      logs: true
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    )
  }
} 