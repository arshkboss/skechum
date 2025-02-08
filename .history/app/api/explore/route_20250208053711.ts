import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const startTime = Date.now()
  try {
    const supabase = createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('[Explore API] Auth error:', authError)
      throw authError
    }

    console.log('[Explore API] Authenticated user:', user?.id)

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '8')
    const start = (page - 1) * limit
    const end = start + limit - 1

    console.log(`[Explore API] Request for category: ${category}, page: ${page}, limit: ${limit}`)

    // Build the base query
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
        featured,
        user_id
      `, { count: 'exact' })
      .order('created_at', { ascending: false })

    // Log the initial query state
    console.log(`[Explore API] Building query for ${category}`)

    // Add category-specific filters
    switch (category) {
      case 'all':
        console.log('[Explore API] All images: no filters')
        break
        
      case 'latest':
        console.log('[Explore API] Latest: ordered by creation date')
        break
        
      case 'trending':
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        query = query.gte('created_at', sevenDaysAgo)
        console.log(`[Explore API] Trending: images after ${sevenDaysAgo}`)
        break
        
      case 'featured':
        query = query.eq('featured', true)
        console.log('[Explore API] Featured: featured=true')
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

    // Log raw data for debugging
    console.log('[Explore API] Raw data:', JSON.stringify(data, null, 2))
    console.log(`[Explore API] Found ${data?.length || 0} images out of ${count} total for ${category}`)

    // Transform and validate each image
    const images = data?.map(item => {
      // Log each item transformation
      console.log('[Explore API] Processing item:', {
        id: item.id,
        user_id: item.user_id,
        has_email: !!item.users?.email,
        has_url: !!item.image_url
      })

      return {
        id: item.id,
        image_url: item.image_url,
        prompt: item.prompt,
        user_email: item.users?.email || 'Anonymous',
        model: item.model || 'Unknown',
        style: item.style,
        created_at: item.created_at,
        generation_time: item.generation_time,
        settings: item.settings || {},
        featured: item.featured
      }
    }) || []

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
    }, { status: 500 })
  }
} 