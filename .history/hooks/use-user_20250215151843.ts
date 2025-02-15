"use client"

import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { useEffect, useState, useCallback } from "react"

const supabase = createClient()

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [credits, setCredits] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const fetchCredits = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        console.error('Error fetching credits:', error)
        return
      }
      
      if (data) {
        console.log('Credits updated:', data.credits)
        setCredits(data.credits)
      }
    } catch (error) {
      console.error('Error in fetchCredits:', error)
    }
  }, [])

  useEffect(() => {
    // Get initial user and set up auth subscription
    const setupAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          await fetchCredits(session.user.id)
        }

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session?.user) {
              setUser(session.user)
              await fetchCredits(session.user.id)
            } else {
              setUser(null)
              setCredits(0)
            }
            setLoading(false)
          }
        )

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Error in auth setup:', error)
        setLoading(false)
      }
    }

    setupAuth()
  }, [fetchCredits])

  // Set up real-time subscription for credits
  useEffect(() => {
    if (!user?.id) return

    console.log('Setting up credits subscription for user:', user.id)

    // Subscribe to user_credits changes
    const subscription = supabase
      .channel(`user_credits:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_credits',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Credits changed:', payload)
          if (payload.new) {
            setCredits(payload.new.credits)
          }
        }
      )
      .subscribe()

    return () => {
      console.log('Cleaning up credits subscription')
      supabase.removeChannel(subscription)
    }
  }, [user?.id])

  const refreshCredits = useCallback(() => {
    if (user?.id) {
      fetchCredits(user.id)
    }
  }, [user?.id, fetchCredits])

  return {
    user,
    credits,
    loading,
    refreshCredits,
    isAuthenticated: !!user,
  }
} 