export interface GeneratedImage {
  url: string
  prompt: string
  timestamp: number
  generationTime?: number
  style?: string
  format?: 'PNG' | 'SVG' | 'JPG'
}

export type GenerationStatus = 'idle' | 'queued' | 'generating' | 'completed' | 'failed'

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'vector_illustration/doodle_line_art',
    label: 'Line Art',
    description: 'Simple vector illustrations with clean lines'
  },
  {
    id: 'digital_illustration/watercolor',
    label: 'Watercolor',
    description: 'Soft, artistic watercolor style'
  },
  {
    id: 'vector_illustration/cartoon',
    label: 'Color Doodle',
    description: 'Colorful and playful doodle line art style'
  },
  {
    id: "flux_lora",
    name: "Flux Lora",
    description: "Unique artistic style with custom Lora model",
    credits: 1
  },
]

export type StyleOption = typeof STYLE_OPTIONS[number]['id'] 