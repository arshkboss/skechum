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
    label: 'Line Art',
    description: 'Simple vector illustrations with clean lines',
    img: '/styles/line_art.png'
  },
  {
    id: 'digital_illustration/watercolor',
    label: 'Watercolor',
    description: 'Soft, artistic watercolor style',
    img: '/styles/watercolor.png'
  },
  {
    id: "flux_lora",
    name: "Color Doodle",
    description: "Colorful and playful doodle line art style",
    img: '/styles/color_doodle.png'
  }
]

export type StyleOption = typeof STYLE_OPTIONS[number]['id'] 