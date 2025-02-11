import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { headers } from 'next/headers'

export async function GET() {
  try {
    // Check if request is from our own frontend
    const headersList = await headers()
    const referer = headersList.get('referer')
    const origin = headersList.get('origin')
    
    // Only allow requests from our own domain
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      'https://skechum.com',
      'http://localhost:3000'
    ].filter(Boolean)
    
    // Type safety: handle origin as string
    const refererOrigin = referer || ''
    if (!refererOrigin || !allowedOrigins.some(allowed => allowed && refererOrigin.startsWith(allowed))) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          }
        }
      )
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Handle cookie setting error
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.delete({ name, ...options })
            } catch (error) {
              // Handle cookie removal error
            }
          },
        },
      }
    )

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // Fetch credits for the authenticated user
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching credits:', error)
      return NextResponse.json(
        { error: 'Failed to fetch credits' }, 
        { 
          status: 500,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // Return response with security headers
    return NextResponse.json(
      { credits: data?.credits || 0 },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, private',
          'Content-Type': 'application/json',
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'https://skechum.com',
          'Access-Control-Allow-Methods': 'GET',
        }
      }
    )

  } catch (error) {
    console.error('Credits API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Content-Type': 'application/json',
        }
      }
    )
  }
}

// Block all other HTTP methods
export async function POST() {
  return new NextResponse('Method not allowed', { status: 405 })
}

export async function PUT() {
  return new NextResponse('Method not allowed', { status: 405 })
}

export async function DELETE() {
  return new NextResponse('Method not allowed', { status: 405 })
}

export async function PATCH() {
  return new NextResponse('Method not allowed', { status: 405 })
} 