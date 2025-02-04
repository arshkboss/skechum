import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function checkAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }
  
  return user;
} 