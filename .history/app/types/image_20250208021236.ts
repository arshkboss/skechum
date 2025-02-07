export type ImageCategory = 
  | 'people' 
  | 'nature' 
  | 'technology' 
  | 'abstract' 
  | 'other';

export interface StorageImage {
  id: string;
  user_id: string;
  image_url: string;
  prompt: string;
  style: string;
  format: string;
  is_colored: boolean;
  keywords: string;
  created_at: string;
  category: ImageCategory;
  description?: string;
  tags?: string[];
  is_public: boolean;
}

export interface ImageSearchParams {
  category?: ImageCategory;
  query?: string;
  page?: number;
  limit?: number;
  userId?: string;
  isPublic?: boolean;
} 