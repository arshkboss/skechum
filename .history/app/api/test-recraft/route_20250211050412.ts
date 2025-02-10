import { fal } from "@fal-ai/client"
import { NextResponse } from "next/server"

fal.config({
  credentials: process.env.FAL_KEY
})

export const maxDuration = 60 // Set maximum duration to 60 seconds
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt, style } = body

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

    if (!result.ok) {
      throw new Error('Generation failed')
    }

    const data = await result.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Recraft API error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
} 