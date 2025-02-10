import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

// Define the params type
type Params = {
  params: {
    id: string
  }
}

export async function GET(
  request: Request,
  context: Promise<Params>
) {
  try {
    // Await the params from the Promise
    const { params } = await context
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_images')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error
    if (!data) throw new Error('Image not found')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching image:', error)
    return new NextResponse('Image not found', { status: 404 })
  }
} 