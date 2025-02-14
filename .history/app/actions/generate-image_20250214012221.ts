'use server'

import { fal } from "@fal-ai/client"

// Configure fal client
fal.config({
  credentials: process.env.FAL_KEY
})

// Define type for the response
export type GenerationResponse = {
  images: { url: string }[]
  error?: string
}

export async function generateImage(prompt: string, style: string = "vector_illustration/doodle_line_art"): Promise<GenerationResponse> {
  try {
    // Add timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Generation timed out')), 50000)
    })

    // Race between the generation and timeout
    const result = await Promise.race([
      // Handle different models based on style
      style === "flux_lora" 
        ? fal.subscribe("fal-ai/flux-lora", {
            input: {
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
            pollInterval: 1000,
          }),
      timeoutPromise
    ])

    return { images: result.images }
  } catch (error) {
    console.error("Generation error:", error)
    return { 
      images: [],
      error: error instanceof Error ? error.message : "Failed to generate image" 
    }
  }
} 