import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get('search')?.trim().toLowerCase()

    // Build query
    let query = supabase.from('user_images').select('*')

    // Add search if provided
    if (searchQuery) {
      query = query.or(
        `prompt.ilike.%${searchQuery}%,` +
        `model.ilike.%${searchQuery}%,` +
        `style.ilike.%${searchQuery}%`
      )
    }

    // Order by latest first
    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    console.log('Search results:', {
      query: searchQuery,
      count: data?.length || 0,
      firstImage: data?.[0]
    })

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    // Cache successful responses for 1 minute in development, longer in production
    const cacheTime = process.env.NODE_ENV === 'development' ? 60 : 3600

    return NextResponse.json({ images: data || [] }, {
      headers: {
        'Cache-Control': `public, s-maxage=${cacheTime}, stale-while-revalidate`,
      },
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      images: [], 
      error: 'Failed to fetch images',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
} 