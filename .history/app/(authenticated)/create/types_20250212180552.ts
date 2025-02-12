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
    id: 'vector_illustration/doodle_line_art',
    name: 'Line Art',
    description: 'Clean, minimalist black & white line illustrations',
    img: '/styles/line_art.png'
  },
  {
    id: "flux_lora",
    name: "Color Doodle",
    description: "Vibrant, playful illustrations with colorful doodle style",
    img: '/styles/color_doodle.png'
  },
  {
    id: 'digital_illustration/watercolor',
    name: 'Watercolor',
    description: 'Soft, dreamy illustrations with watercolor effects',
    img: '/styles/watercolor.png'
  }
]

export type StyleOption = typeof STYLE_OPTIONS[number]['id'] 