import { createClient } from "@/utils/supabase/server"
import { cookies } from 'next/headers'
import { cache } from 'react'

// Cache the fetch to prevent duplicate requests
export const getImages = cache(async (userId: string, page: number, perPage: number) => {
  const supabase = createServerClient(cookies())
  const start = (page - 1) * perPage
  const end = start + perPage - 1

  const { data, error, count } = await supabase
    .from('user_images')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(start, end)

  if (error) {
    console.error('Error fetching user images:', error)
    return { data: null, error, count: 0 }
  }

  return { data, error: null, count }
}) 