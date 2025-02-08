import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '8')
    const start = (page - 1) * limit
    const end = start + limit - 1

    // Get all public images from the storage bucket
    let query = supabase
      .from('user_images')
      .select(`
        id,
        image_url,
        prompt,
        user_id,
        users:user_id (
          email
        ),
        model,
        style,
        created_at,
        generation_time,
        settings,
        featured
      `)
      .order('created_at', { ascending: false })

    // Add category-specific filters
    switch (category) {
      case 'trending':
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        query = query.gte('created_at', sevenDaysAgo)
        break
      case 'featured':
        query = query.eq('featured', true)
        break
      // 'all' and 'latest' don't need additional filters
    }

    // Add pagination
    query = query.range(start, end)

    const { data, error, count } = await query

    if (error) {
      console.error('Database query error:', error)
      throw error
    }

    // Transform the data
    const images = data?.map(item => ({
      id: item.id,
      image_url: item.image_url,
      prompt: item.prompt || '',
      user_email: item.users?.email || 'Anonymous',
      model: item.model || 'Unknown',
      style: item.style,
      created_at: item.created_at,
      generation_time: item.generation_time,
      settings: item.settings || {},
      featured: item.featured
    })) || []

    return NextResponse.json({
      images,
      total: count,
      page,
      hasMore: data?.length === limit
    })

  } catch (error) {
    console.error('Error in explore API:', error)
    return NextResponse.json({ 
      images: [],
      error: 'Failed to fetch images'
    }, { status: 500 })
  }
} 