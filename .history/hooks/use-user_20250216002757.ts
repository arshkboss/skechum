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
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single()
    
    if (!error && data) {
      setCredits(data.credits)
    }
  }, [supabase])

  const refreshCredits = useCallback(() => {
    if (user?.id) {
      fetchCredits(user.id)
    }
  }, [user?.id, fetchCredits])

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
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

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchCredits(session.user.id)
      }
      setLoading(false)
    })

    // Set up real-time subscription for credits
    const channel = supabase
      .channel('credits_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_credits',
          filter: user?.id ? `user_id=eq.${user.id}` : undefined
        },
        (payload) => {
          console.log('Credits changed:', payload)
          if (user?.id) {
            fetchCredits(user.id)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [supabase, user?.id, fetchCredits])

  return {
    user,
    credits,
    loading,
    refreshCredits,
    isAuthenticated: !!user,
  }
} 