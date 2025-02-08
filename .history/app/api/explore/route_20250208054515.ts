import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // Step 1: Basic fetch of all images
    const { data, error } = await supabase
      .from('user_images')
      .select('*')

    console.log('Basic fetch result:', {
      success: !error,
      count: data?.length || 0,
      firstImage: data?.[0]
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ images: data || [] })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ images: [], error: 'Failed to fetch images' }, { status: 500 })
  }
} 