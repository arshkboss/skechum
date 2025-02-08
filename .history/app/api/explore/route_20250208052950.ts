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
        settings,
        featured
      `)
      .order('created_at', { ascending: false })

    // Add category-specific filters
    switch (category) {
      case 'trending':
        // Get images from last 7 days
        query = query.gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        break
      case 'featured':
        // Get featured images, including those with null featured value (since true is default)
        query = query.or('featured.is.null,featured.eq.true')
        break
      case 'latest':
        // No additional filters for latest
        break
      default:
        console.log('Unknown category:', category)
    }

    // Add range after filters
    query = query.range(start, end)

    console.log('Executing query for category:', category)
    const { data, error } = await query

    if (error) {
      console.error('Supabase query error:', error)
      throw error
    }

    console.log(`Found ${data?.length || 0} images for category ${category}`)

    // Always return an array, even if empty
    const images = data ? data.map(item => ({
      ...item,
      user_email: item.users?.email || 'Anonymous'
    })) : []

    return NextResponse.json({ images })

  } catch (error) {
    console.error('Error fetching explore images:', error)
    return NextResponse.json({ images: [] })
  }
} 