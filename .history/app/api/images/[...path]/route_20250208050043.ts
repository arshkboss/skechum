import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const supabase = createClient()
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const filePath = params.path.join('/')
    
    // Get the image from storage
    const { data, error } = await supabase
      .storage
      .from('user-images')
      .download(filePath)

    if (error || !data) {
      return new NextResponse('Not Found', { status: 404 })
    }

    // Return the image with proper headers
    return new NextResponse(data, {
      headers: {
        'Content-Type': data.type || 'image/png', // Fallback to png if type is not available
        'Cache-Control': 'public, max-age=31536000',
        'Content-Disposition': 'inline',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 