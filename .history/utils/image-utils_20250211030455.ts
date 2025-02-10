import { createClient } from '@/utils/supabase/client'
import { StorageImage, ImageCategory, ImageSearchParams } from '@/app/types/image'
import { ImageFormat } from './images'  // Import the type


const IMAGES_PER_PAGE = 20

export const imageUtils = {
  // Function to categorize images based on their names
  categorizeImage: (imageName: string): ImageCategory => {
    const nameLC = imageName.toLowerCase()
    if (nameLC.includes('woman') || nameLC.includes('man') || nameLC.includes('person')) {
      return 'people'
    }
    if (nameLC.includes('nature') || nameLC.includes('landscape')) {
      return 'nature'
    }
    if (nameLC.includes('tech') || nameLC.includes('robot')) {
      return 'technology'
    }
    if (nameLC.includes('abstract')) {
      return 'abstract'
    }
    return 'other'
  },

  // Function to fetch images with pagination and filtering
  async fetchImages({ 
    category, 
    query, 
    page = 1, 
    limit = IMAGES_PER_PAGE,
    userId,
    isPublic = true
  }: ImageSearchParams): Promise<{ data: StorageImage[], count: number }> {
    const supabase = createClient()
    const startIndex = (page - 1) * limit
    
    try {
      console.log('Fetching images with params:', { category, query, page, limit, userId, isPublic })
      
      let queryBuilder = supabase
        .from('user_images')
        .select('*', { count: 'exact' })
      
      // Apply filters
      if (isPublic) {
        queryBuilder = queryBuilder.eq('is_public', true)
      }
      
      if (userId) {
        queryBuilder = queryBuilder.eq('user_id', userId)
      }
      
      if (category) {
        queryBuilder = queryBuilder.eq('category', category)
      }
      
      if (query) {
        queryBuilder = queryBuilder.or(
          `keywords.ilike.%${query}%,prompt.ilike.%${query}%,description.ilike.%${query}%`
        )
      }
      
      const { data, error, count } = await queryBuilder
        .range(startIndex, startIndex + limit - 1)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching images:', error)
        throw error
      }
      
      return { 
        data: data as StorageImage[], 
        count: count || 0 
      }
    } catch (error) {
      console.error('Error in fetchImages:', error)
      throw error
    }
  }
}

export async function detectImageFormat(url: string): Promise<'PNG' | 'SVG' | 'JPG'> {
  try {
    const response = await fetch(url)
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('svg')) return 'SVG'
    if (contentType?.includes('png')) return 'PNG'
    if (contentType?.includes('jpeg') || contentType?.includes('jpg')) return 'JPG'
    
    return 'PNG' // Default to PNG if unknown
  } catch (error) {
    console.error('Error detecting image format:', error)
    return 'PNG'
  }
}

export async function convertImage(
  input: File | Blob | string,
  fromFormat: ImageFormat,
  toFormat: ImageFormat
): Promise<Blob> {
  if (fromFormat === toFormat) {
    const response = await fetch(input as string)
    return response.blob()
  }

  if (fromFormat === 'SVG') {
    // Convert SVG to PNG/JPG
    const response = await fetch(input as string)
    const svgText = await response.text()
    
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }
        
        ctx.drawImage(img, 0, 0)
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error('Failed to convert image'))
          },
          `image/${toFormat.toLowerCase()}`,
          0.9
        )
      }
      img.onerror = () => reject(new Error('Failed to load SVG'))
      img.src = 'data:image/svg+xml,' + encodeURIComponent(svgText)
    })
  }

  // For other conversions, just return the original format
  const response = await fetch(input as string)
  return response.blob()
} 