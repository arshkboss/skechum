export interface GeneratedImage {
  url: string
  prompt: string
  timestamp: number
  generationTime?: number
  style?: string
  format?: 'PNG' | 'SVG' | 'JPG'
}

export type GenerationStatus = 'idle' | 'queued' | 'generating' | 'completed' | 'failed'

export const STYLE_OPTIONS = [
  {
    id: "flux_lora",
    name: "Color Doodle",
    description: "Playful and vibrant doodle art with colorful elements",
    img: '/styles/color_doodle.png'
  },
  {
    id: 'vector_illustration/doodle_line_art',
    name: 'Line Art',
    description: 'Simple black & white line drawings with clean, minimal style',
    img: '/styles/line_art.png'
  },
  
  {
    id: 'digital_illustration/watercolor',
    name: 'Watercolor',
    description: 'Soft and artistic illustrations with watercolor textures',
    img: '/styles/watercolor.png'
  }
]

export type StyleOption = typeof STYLE_OPTIONS[number]['id'] 