import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(payments)
  } catch (error) {
    console.error("[PAYMENTS_HISTORY]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 