import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getUserCredits(userId: string) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user credits:', error);
      throw error;
    }
    
    return data?.credits ?? 0;
  } catch (error) {
    console.error('Error in getUserCredits:', error);
    return 0;
  }
}

export async function updateUserCredits(userId: string, newCredits: number) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('user_credits')
      .update({ credits: newCredits, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user credits:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateUserCredits:', error);
    throw error;
  }
}

export async function initializeUserCredits(userId: string, initialCredits: number = 10) {
  const supabase = await createClient();
  
  try {
    // Check if user already has credits
    const { data: existing } = await supabase
      .from('user_credits')
      .select()
      .eq('user_id', userId)
      .single();
    
    if (existing) {
      console.log('User already has credits initialized');
      return existing;
    }
    
    // Create new credits record
    const { data, error } = await supabase
      .from('user_credits')
      .insert([
        {
          user_id: userId,
          credits: initialCredits,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error initializing user credits:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in initializeUserCredits:', error);
    throw error;
  }
}

export async function deductCredits(userId: string, amount: number) {
  const supabase = await createClient();
  
  try {
    // Get current credits
    const currentCredits = await getUserCredits(userId);
    
    // Check if user has enough credits
    if (currentCredits < amount) {
      throw new Error('Insufficient credits');
    }
    
    // Update credits
    const newCredits = currentCredits - amount;
    return await updateUserCredits(userId, newCredits);
  } catch (error) {
    console.error('Error in deductCredits:', error);
    throw error;
  }
} 