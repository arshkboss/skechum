export interface GeneratedImage {
  url: string
  prompt: string
  timestamp: number
  generationTime?: number
}

export type GenerationStatus = 'idle' | 'queued' | 'generating' | 'completed' | 'failed' 