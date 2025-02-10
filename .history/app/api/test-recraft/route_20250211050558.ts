import { fal } from "@fal-ai/client"
import { NextResponse } from "next/server"

fal.config({
  credentials: process.env.FAL_KEY
})

export async function POST(request: Request) {
  try {
    const { prompt, style = "vector_illustration/doodle_line_art" } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing prompt" },
        { status: 400 }
      )
    }

    const result = await fal.subscribe("fal-ai/recraft-20b", {
      input: {
        prompt,
        image_size: "square_hd",
        style,
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