import { createClient } from "@/utils/supabase/server";
import { ImageFormat } from './images'  // Import the type

export async function uploadImage(
  userId: string,
  file: File | Blob,
  format: ImageFormat  // Use the imported ImageFormat type
): Promise<string> {
  const supabase = await createClient();
  
  try {
    // Create a unique filename
    const timestamp = new Date().getTime();
    const filename = `${userId}/${timestamp}-${Math.random().toString(36).substring(7)}.${format.toLowerCase()}`;
    
    // Upload the file
    const { data, error } = await supabase
      .storage
      .from('user-images')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('user-images')
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
}

export async function deleteImage(imagePath: string) {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase
      .storage
      .from('user-images')
      .remove([imagePath]);
    
    if (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteImage:', error);
    throw error;
  }
} 