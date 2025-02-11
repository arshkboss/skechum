import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Create a public Supabase client without authentication
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    // Get search parameters
    const searchQuery = searchParams.get('search')?.trim().toLowerCase()
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '8')

    // Calculate offset for pagination
    const offset = (page - 1) * limit

    // Build base query to select public images
    let query = supabase
      .from('user_images')
      .select('*', { count: 'exact' })
      // Only select published/public images
      .eq('is_public', true)

    // Add search filters if search query exists
    if (searchQuery) {
      query = query.or(
        `prompt.ilike.%${searchQuery}%,` +
        `model.ilike.%${searchQuery}%,` +
        `style.ilike.%${searchQuery}%`
      )
    }

    // Add category filters if needed
    if (category && category !== 'all') {
      switch (category) {
        case 'latest':
          // No additional filter needed, just sort by date
          break
        case 'trending':
          // Add filter for trending images (e.g., by likes or views)
          query = query.gte('likes_count', 5)
          break
        case 'featured':
          // Add filter for featured images
          query = query.eq('is_featured', true)
          break
      }
    }

    // Add pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Execute the query
    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    // Calculate if there are more images
    const hasMore = count ? offset + limit < count : false

    // Cache successful responses
    const cacheTime = process.env.NODE_ENV === 'development' ? 60 : 3600

    return NextResponse.json(
      { 
        images: data || [],
        hasMore,
        total: count
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${cacheTime}, stale-while-revalidate`,
        },
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      images: [], 
      error: 'Failed to fetch images',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
} 