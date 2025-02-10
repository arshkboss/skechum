import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing generation ID' }, { status: 400 })
    }

    // Call Fal.ai status endpoint
    const response = await fetch(`https://fal.run/status/${id}`, {
      headers: {
        // Your headers...
      }
    })

    if (!response.ok) {
      throw new Error('Status check failed')
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json({ error: 'Status check failed' }, { status: 500 })
  }
} 