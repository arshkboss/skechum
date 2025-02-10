import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function GET(
  request: NextRequest,
  props: Props
) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_images')
      .select('*')
      .eq('id', props.params.id)
      .single()

    if (error) throw error
    if (!data) throw new Error('Image not found')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching image:', error)
    return NextResponse.json(
      { error: 'Image not found' }, 
      { status: 404 }
    )
  }
} 