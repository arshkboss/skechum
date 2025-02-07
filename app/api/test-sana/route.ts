import { fal } from "@fal-ai/client"
import { NextResponse } from "next/server"

fal.config({
  credentials: process.env.FAL_KEY
})

export async function POST(request: Request) {
  try {
    const { prompt, size, num_inference_steps, guidance_scale, negative_prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing prompt" },
        { status: 400 }
      )
    }

    const result = await fal.subscribe("fal-ai/sana", {
      input: {
        prompt,
        negative_prompt: negative_prompt || "",
        image_size: size === 'square' ? 'square_hd' : 
                   size === 'portrait' ? 'portrait_16_9' : 'landscape_16_9',
        num_inference_steps: num_inference_steps || 18,
        guidance_scale: guidance_scale || 7,
        num_images: 1,
        enable_safety_checker: true,
        output_format: "png",
        style_name: undefined
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