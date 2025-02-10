import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// The params should not be a Promise in the type definition
interface RouteContext {
  params: {
    id: string
  }
}

export async function GET(
  req: NextRequest,
  { params }: RouteContext  // Destructure params directly from the context
) {
  try {
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