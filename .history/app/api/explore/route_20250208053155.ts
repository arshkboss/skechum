import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const startTime = Date.now()
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '8')
    const start = (page - 1) * limit
    const end = start + limit - 1

    console.log(`[Explore API] Request for category: ${category}, page: ${page}, limit: ${limit}`)

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
      `, { count: 'exact' })
      .order('created_at', { ascending: false })

    // Log the initial query state
    console.log(`[Explore API] Building query for ${category}`)

    // Add category-specific filters
    switch (category) {
      case 'trending':
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        query = query.gte('created_at', sevenDaysAgo)
        console.log(`[Explore API] Trending filter: after ${sevenDaysAgo}`)
        break
      case 'featured':
        query = query.eq('featured', true)
        console.log('[Explore API] Featured filter: featured = true')
        break
      case 'latest':
        console.log('[Explore API] Latest: no additional filters')
        break
    }

    // Add range after filters
    query = query.range(start, end)

    // Execute query and log results
    console.log(`[Explore API] Executing query...`)
    const { data, error, count } = await query

    if (error) {
      console.error('[Explore API] Query error:', error)
      throw error
    }

    console.log(`[Explore API] Found ${data?.length || 0} images out of ${count} total for ${category}`)
    
    // Log each image for debugging
    data?.forEach((item, index) => {
      console.log(`[Explore API] Image ${index + 1}:`, {
        id: item.id,
        featured: item.featured,
        created_at: item.created_at,
        user: item.users?.email
      })
    })

    const images = data ? data.map(item => ({
      ...item,
      user_email: item.users?.email || 'Anonymous'
    })) : []

    const responseTime = Date.now() - startTime
    console.log(`[Explore API] Request completed in ${responseTime}ms`)

    return NextResponse.json({ 
      images,
      total: count,
      page,
      hasMore: count ? start + images.length < count : false
    })

  } catch (error) {
    console.error('[Explore API] Error:', error)
    return NextResponse.json({ 
      images: [], 
      error: 'Failed to fetch images',
      errorDetails: process.env.NODE_ENV === 'development' ? error : undefined
    })
  }
} 