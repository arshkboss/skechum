export type ImageCategory = 
  | 'people' 
  | 'nature' 
  | 'technology' 
  | 'abstract' 
  | 'other';

export interface StorageImage {
  id: string;
  name: string;
  url: string;
  category: ImageCategory;
  tags: string[];
  created_at: string;
  owner: string;
  description?: string;
}

export interface ImageSearchParams {
  category?: ImageCategory;
  query?: string;
  page?: number;
  limit?: number;
} 