'use server'

import { fal } from "@fal-ai/client"
import { revalidatePath } from "next/cache"
import { saveUserImage } from "@/services/images"
import { StyleOption } from "@/app/(authenticated)/create/types"

// Configure fal client
fal.config({
  credentials: process.env.FAL_KEY
})

// Define the allowed style types for FAL AI API
type FalStyleType = 
  | "vector_illustration/doodle_line_art"
  | "digital_illustration/watercolor"
  | "flux_lora"

interface GenerateImageParams {
  prompt: string
  style: StyleOption
  userId: string
}

// Define type for the response
export type GenerationResponse = {
  imageUrl?: string
  error?: string
  generationTime?: number
  format?: 'PNG' | 'SVG' | 'JPG'
}

// Define the expected result type from fal.subscribe
interface FalResult {
  data: {
    images: Array<{
      url: string
    }>
  }
}

export async function generateImage({ 
  prompt, 
  style, 
  userId 
}: GenerateImageParams): Promise<GenerationResponse> {
  const startTime = Date.now()

  try {
    // First attempt to deduct credits
    const deductResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/credits/deduct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ style })
    })

    if (!deductResponse.ok) {
      const error = await deductResponse.json()
      if (error.error === 'Insufficient credits') {
        return { error: 'insufficient_credits' }
      }
      throw new Error(error.error || 'Failed to process credits')
    }

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
              // Prepend "colordoodle" to the user's prompt for flux_lora model
              prompt: `colordoodle ${prompt}`,
              //@ts-ignore
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
    ]) as FalResult

    const generationTime = Date.now() - startTime
    const imageUrl = result.data.images[0].url

    // Save the image
    if (userId) {
      await saveUserImage(
        imageUrl,
        {
          prompt,
          settings: {
            model: 'recraft',
            size: 'square_hd',
            style,
          },
          generationTime,
          format: 'PNG',
          is_colored: true,
          keywords: prompt.toLowerCase().split(' ')
        },
        userId
      )
    }

    revalidatePath('/create')
    return { 
      imageUrl, 
      generationTime,
      format: 'PNG'
    }

  } catch (error) {
    console.error("Generation error:", error)
    
    // Handle timeout specifically
    if (error instanceof Error && error.message === 'Generation timed out') {
      // Attempt to refund credits
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/credits/refund`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            style,
            reason: 'timeout'
          })
        })
      } catch (refundError) {
        console.error('Failed to refund credits:', refundError)
      }
      
      return { error: 'generation_timeout' }
    }
    
    return { 
      error: error instanceof Error ? error.message : "Failed to generate image" 
    }
  }
} 