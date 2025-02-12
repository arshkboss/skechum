export interface UserImage {
  id: string
  image_url: string
  prompt: string
  style: string | null
  format: 'PNG' | 'SVG' | 'JPG'
  settings: {
    model: string
    size: string
    steps?: number
    guidance?: number
  }
  generation_time: number
  created_at: string
} 