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
      query = query.or(`
        prompt.ilike.%${searchQuery}%,
        model.ilike.%${searchQuery}%,
        style.ilike.%${searchQuery}%
      `)
    }

    // Order by latest first
    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    console.log('Search results:', {
      query: searchQuery,
      count: data?.length || 0
    })

    if (error) throw error

    return NextResponse.json({ images: data || [] })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ images: [], error: 'Failed to fetch images' }, { status: 500 })
  }
} 