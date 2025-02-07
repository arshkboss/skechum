export type RecraftImageSize = 
  | 'square_hd'
  | 'square'
  | 'portrait_4_3'
  | 'portrait_16_9'
  | 'landscape_4_3'
  | 'landscape_16_9';

export type RecraftStyle = 
  | 'vector_illustration/line_art'
  | 'vector_illustration/bold_stroke'
  | 'vector_illustration/thin'
  // Add other styles as needed

export interface RecraftResponse {
  images: {
    url: string;
  }[];
} 