import { createClient } from "@/utils/supabase/server";
import { Database } from "@/types/database";
import { deductCredits } from "./credits";
import { uploadImage } from "./storage";

type ImageFormat = Database['public']['Tables']['user_images']['Row']['format'];

interface GenerateImageParams {
  userId: string;
  prompt: string;
  style: string;
  format: ImageFormat;
  isColored: boolean;
}

export async function storeGeneratedImage({
  userId,
  prompt,
  style,
  format,
  isColored,
  imageUrl,
}: GenerateImageParams & { imageUrl: string }) {
  const supabase = await createClient();
  
  try {
    // Extract keywords from prompt
    const keywords = extractKeywords(prompt);
    
    const { data, error } = await supabase
      .from('user_images')
      .insert([
        {
          user_id: userId,
          image_url: imageUrl,
          prompt,
          style,
          format,
          is_colored: isColored,
          keywords,
        }
      ])
      .select()
      .single();
      
    if (error) {
      console.error('Error storing image:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in storeGeneratedImage:', error);
    throw error;
  }
}

export async function generateImage(params: GenerateImageParams) {
  const { userId, format } = params;
  
  try {
    // Calculate credits needed
    const creditsNeeded = format === 'SVG' ? 5 : 3;
    
    // Deduct credits first
    await deductCredits(userId, creditsNeeded);
    
    // Generate image (implement your generation logic here)
    // const imageBlob = await yourGenerationService.generate(params);
    const imageBlob = new Blob(['temporary']); // Replace with actual generation
    const file = new File([imageBlob], `temp.${format.toLowerCase()}`, { 
      type: format === 'PNG' ? 'image/png' : 'image/svg+xml' 
    });
    
    // Upload to Supabase storage
    const imageUrl = await uploadImage(userId, file, format);
    
    // Store image data
    const imageData = await storeGeneratedImage({
      ...params,
      imageUrl,
    });
    
    return imageData;
  } catch (error) {
    console.error('Error in generateImage:', error);
    throw error;
  }
}

export async function getUserImages(userId: string, page = 1, limit = 20) {
  const supabase = await createClient();
  
  try {
    const { data, error, count } = await supabase
      .from('user_images')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);
      
    if (error) {
      console.error('Error fetching user images:', error);
      throw error;
    }
    
    return { data, count };
  } catch (error) {
    console.error('Error in getUserImages:', error);
    throw error;
  }
}

function extractKeywords(prompt: string): string[] {
  // Remove special characters and split into words
  const words = prompt.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2); // Filter out short words
    
  // Remove duplicates
  return [...new Set(words)];
} 