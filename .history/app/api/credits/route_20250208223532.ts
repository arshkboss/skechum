import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch credits for the authenticated user
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', session.user.id)
      .single()

    if (error) {
      console.error('Error fetching credits:', error)
      return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Credits API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 