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

    // Add strong caching headers for images
    const headers = new Headers({
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'application/json',
      // Add Surrogate-Control for CDN caching
      'Surrogate-Control': 'public, max-age=31536000',
      // Add Vary header to properly cache different versions
      'Vary': 'Accept-Encoding',
      // Add stale-while-revalidate for smoother updates
      'stale-while-revalidate': '86400'
    })

    return NextResponse.json(
      { 
        images: data?.map(img => ({
          ...img,
          image_url: img.image_url + '?cache=' + new Date(img.created_at).getTime() // Add cache buster based on creation date
        })) || [],
        hasMore,
        total: count
      },
      { headers }
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