import { createClient } from '@/lib/supabase/client'
import { StorageImage, ImageCategory, ImageSearchParams } from '@/app/types/image'


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
    limit = IMAGES_PER_PAGE 
  }: ImageSearchParams): Promise<{ data: StorageImage[], count: number }> {
    const supabase = createClient()
    const startIndex = (page - 1) * limit
    
    try {
      console.log('Fetching images with params:', { category, query, page, limit })
      
      let queryBuilder = supabase
        .from('images')
        .select('*', { count: 'exact' })
      
      if (category) {
        queryBuilder = queryBuilder.eq('category', category)
      }
      
      if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
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