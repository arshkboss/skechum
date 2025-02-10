import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// For App Router, the params are passed as part of the second argument
export async function GET(
  request: NextRequest,
  { params }: {
    params: {
      id: string
    }
  }
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
    return NextResponse.json(
      { error: 'Image not found' }, 
      { status: 404 }
    )
  }
} 