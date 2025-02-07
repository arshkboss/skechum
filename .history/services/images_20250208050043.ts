import { createClient } from "@/utils/supabase/client"
import { v4 as uuidv4 } from "uuid"

const supabase = createClient()

export interface ImageMetadata {
  prompt: string
  settings: {
    model: string
    size: string
    steps?: number
    guidance?: number
    negative_prompt?: string
    style?: string
  }
  generationTime?: number
  format: string
  is_colored: boolean
  keywords?: string[]
}

export async function saveUserImage(
  imageUrl: string, 
  metadata: ImageMetadata,
  userId: string
) {
  try {
    // First, fetch the image and convert to blob
    const response = await fetch(imageUrl)
    const imageBlob = await response.blob()

    // Generate unique filename
    const filename = `${uuidv4()}.${metadata.format}`
    const filePath = `${userId}/${filename}`

    // Upload to Supabase Storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('user-images')
      .upload(filePath, imageBlob, {
        contentType: `image/${metadata.format}`,
        cacheControl: '3600',
        upsert: false
      })

    if (storageError) throw storageError

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('user-images')
      .getPublicUrl(filePath)

    // Save to database
    const { data: dbData, error: dbError } = await supabase
      .from('user_images')
      .insert({
        user_id: userId,
        image_url: publicUrl,
        prompt: metadata.prompt,
        style: metadata.settings.style || null,
        format: metadata.format,
        is_colored: metadata.is_colored,
        keywords: metadata.keywords || [],
        settings: metadata.settings, // JSON column for flexible storage
        generation_time: metadata.generationTime,
        model: metadata.settings.model
      })
      .select()
      .single()

    if (dbError) throw dbError

    return { data: dbData, error: null }

  } catch (error) {
    console.error('Error saving image:', error)
    return { data: null, error }
  }
}

export async function getUserImages(
  userId: string,
  page: number = 1,
  limit: number = 12
) {
  const start = (page - 1) * limit
  const end = start + limit - 1

  const { data, error } = await supabase
    .from('user_images')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(start, end)

  if (error) {
    console.error('Error fetching user images:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

// Add a function to create a secure public URL
export function createSecureImageUrl(imageUrl: string) {
  try {
    const url = new URL(imageUrl)
    // Keep the full path after 'user-images/'
    const pathMatch = url.pathname.match(/user-images\/(.+)/)
    if (pathMatch && pathMatch[1]) {
      return `/api/images/${pathMatch[1]}`
    }
    return imageUrl
  } catch {
    return imageUrl
  }
} 