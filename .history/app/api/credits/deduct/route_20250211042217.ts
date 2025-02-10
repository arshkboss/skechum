import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const body = await request.json()
    const { style } = body


    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Calculate credits to deduct based on style
    const creditsToDeduct = style === 'vector_illustration/doodle_line_art' ? 2 : 1

    // Start a transaction to update credits
    const { data: userData, error: fetchError } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 })
    }

    if (!userData || userData.credits < creditsToDeduct) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 })
    }

    // Update credits
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ credits: userData.credits - creditsToDeduct })
      .eq('user_id', user.id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      remainingCredits: userData.credits - creditsToDeduct 
    })

  } catch (error) {
    console.error('Credit deduction error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 