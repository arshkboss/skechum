import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_images')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) throw new Error('Image not found')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching image:', error)
    return new NextResponse('Image not found', { status: 404 })
  }
} 