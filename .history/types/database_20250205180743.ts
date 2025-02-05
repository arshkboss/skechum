export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_credits: {
        Row: {
          id: string
          user_id: string
          credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          credits: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          credits?: number
          updated_at?: string
        }
      }
      user_images: {
        Row: {
          id: string
          user_id: string
          image_url: string
          prompt: string
          style: string
          format: 'PNG' | 'SVG'
          is_colored: boolean
          keywords: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          prompt: string
          style: string
          format: 'PNG' | 'SVG'
          is_colored: boolean
          keywords: string[]
          created_at?: string
        }
        Update: {
          image_url?: string
          prompt?: string
          style?: string
          format?: 'PNG' | 'SVG'
          is_colored?: boolean
          keywords?: string[]
        }
      }
    }
  }
} 