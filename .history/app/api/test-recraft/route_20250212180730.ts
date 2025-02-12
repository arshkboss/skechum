import { fal } from "@fal-ai/client"
import { NextResponse } from "next/server"

fal.config({
  credentials: process.env.FAL_KEY
})

export const maxDuration = 30 // Set max duration to 30 seconds for Vercel

export async function POST(request: Request) {
  try {
    const { prompt, style = "vector_illustration/doodle_line_art" } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing prompt" },
        { status: 400 }
      )
    }

    // Add timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Generation timed out')), 25000) // 25 second timeout
    })

    // Race between the generation and timeout
    const result = await Promise.race([
      // Handle different models based on style
      style === "flux_lora" 
        ? fal.subscribe("fal-ai/flux-lora", {
            input: {
              // Prepend "colordoodle" to the user's prompt for flux_lora model
              prompt: `colordoodle ${prompt}`,
              // @ts-ignore
              model_name: null,
              loras: [{
                path: "https://v3.fal.media/files/rabbit/L9zZ0FZP-BEfN36McaQMj_pytorch_lora_weights.safetensors",
                scale: 1
              }],
              embeddings: [],
              output_format: "png",
              image_size: "square_hd"
            },
            logs: true,
            pollInterval: 1000,
          })
        : fal.subscribe("fal-ai/recraft-20b", {
            input: {
              prompt,
              image_size: "square_hd",
              style,
              colors: []
            },
            logs: true,
            pollInterval: 1000, // Poll every second
          }),
      timeoutPromise
    ])

    return NextResponse.json(result)
  } catch (error) {
    console.error("Generation error:", error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === 'Generation timed out') {
        return NextResponse.json(
          { error: "Generation timed out. Please try again." },
          { status: 504 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    )
  }
} 