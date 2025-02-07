import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  
  // Get the site URL based on environment
  const siteUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000'  // Development URL
    : process.env.NEXT_PUBLIC_SITE_URL;  // Production URL
  
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('Auth error:', error);
      return NextResponse.redirect(`${siteUrl}/`);
    }
  }

  // Get the redirect path or default to create
  const redirectTo = requestUrl.searchParams.get("redirect_to");
  const redirectUrl = redirectTo 
    ? `${siteUrl}${redirectTo}` 
    : `${siteUrl}/create`;

  return NextResponse.redirect(redirectUrl);
}
