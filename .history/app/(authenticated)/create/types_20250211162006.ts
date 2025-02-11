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
    description: 'Simple vector illustrations with clean lines'
  },
  {
    id: 'digital_illustration/watercolor',
    label: 'Watercolor',
    description: 'Soft, artistic watercolor style'
  }
] as const

export type StyleOption = typeof STYLE_OPTIONS[number]['id'] 