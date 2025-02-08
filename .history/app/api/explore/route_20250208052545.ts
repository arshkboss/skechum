import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '8')
    const start = (page - 1) * limit
    const end = start + limit - 1

    const supabase = createClient()

    let query = supabase
      .from('user_images')
      .select(`
        id,
        image_url,
        prompt,
        users:user_id(email),
        model,
        style,
        created_at,
        generation_time,
        settings
      `)
      .order('created_at', { ascending: false })
      .range(start, end)

    // Add category-specific filters
    switch (category) {
      case 'trending':
        query = query.gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        break
      case 'featured':
        query = query.eq('featured', true)
        break
    }

    const { data, error } = await query

    if (error) throw error

    // Always return an array, even if empty
    const images = data ? data.map(item => ({
      ...item,
      user_email: item.users?.email || 'Anonymous'
    })) : []

    return NextResponse.json({ images })

  } catch (error) {
    console.error('Error fetching explore images:', error)
    // Return empty array instead of error to maintain consistent format
    return NextResponse.json({ images: [] })
  }
} 