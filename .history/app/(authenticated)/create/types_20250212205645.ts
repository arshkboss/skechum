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
    description: 'Simple b&w line drawings',
    img: '/styles/line_art.png'
  },
  
  {
    id: 'digital_illustration/watercolor',
    name: 'Watercolor',
    description: 'Artistic watercolor style',
    img: '/styles/watercolor.png'
  }
]

export type StyleOption = typeof STYLE_OPTIONS[number]['id']

// Define the structure for style credit costs
export interface StyleCreditCost {
  credits: number;
  description?: string;
}

// Map of style IDs to their credit costs
export const STYLE_CREDIT_COSTS: Record<string, StyleCreditCost> = {
  'vector_illustration/doodle_line_art': {
    credits: 3,
    description: 'Doodle Line Art Style'
  },
  'flux_lora': {
    credits: 2,
    description: 'Color Doodle Style'
  },
  'digital_illustration/watercolor': {
    credits: 2,
    description: 'Watercolor Style'
  },
  'default': {
    credits: 1,
    description: 'Standard Style'
  },

  // Easy to add new styles with different credit costs
  // Example:
  // 'premium_style': {
  //   credits: 3,
  //   description: 'Premium Quality Style'
  // }
}; 