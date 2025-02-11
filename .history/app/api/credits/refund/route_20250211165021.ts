import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const body = await request.json()
    const { style } = body

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

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Calculate credits to refund
    const creditsToRefund = style === 'vector_illustration/doodle_line_art' ? 2 : 1

    // Refund the credits
    const { error: updateError } = await supabase.rpc('refund_credits', {
      p_user_id: user.id,
      p_credits: creditsToRefund
    })

    if (updateError) {
      return NextResponse.json({ error: 'Failed to refund credits' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Credit refund error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 