import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    // Get search parameters
    const searchQuery = searchParams.get('search')?.trim().toLowerCase()
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '8')

    console.log('Fetching images with params:', { searchQuery, category, page, limit })

    // Calculate offset for pagination
    const offset = (page - 1) * limit

    // Start with a simple query first
    let query = supabase
      .from('user_images')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Add search if provided
    if (searchQuery) {
      query = query.or(`prompt.ilike.%${searchQuery}%`)
    }

    // Execute the query
    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log('Query results:', {
      count,
      resultsCount: data?.length || 0,
      firstResult: data?.[0]
    })

    // Calculate if there are more images
    const hasMore = count ? offset + limit < count : false

    return NextResponse.json(
      { 
        images: data || [],
        hasMore,
        total: count
      },
      {
        headers: {
          'Cache-Control': 'no-cache' // Disable cache during debugging
        },
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      images: [], 
      error: 'Failed to fetch images',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 