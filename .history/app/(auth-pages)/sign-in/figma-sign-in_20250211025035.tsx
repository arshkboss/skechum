"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function FigmaSignin() {
  const [isFigmaLoading, setIsFigmaLoading] = useState<boolean>(false);
  const supabase = createClient();

  const searchParams = useSearchParams();
  
  // Get both next and return_url parameters
  const next = searchParams.get("next");
  const returnUrl = searchParams.get("return_url");
  
  // Use return_url if available, otherwise fall back to next
  const redirectPath = returnUrl || next || "";

  async function signInFigma() {
    setIsFigmaLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "figma",
        options: {
          redirectTo: `${window.location.origin}/auth/callback${
            redirectPath ? `?next=${encodeURIComponent(redirectPath)}` : ""
          }`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      toast({
        title: "Please try again.",
        description: "There was an error logging in with Figma.",
        variant: "destructive",
      });
      setIsFigmaLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={signInFigma}
      disabled={isFigmaLoading}
    >
      {isFigmaLoading ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <Image
          src="https://authjs.dev/img/providers/figma.svg"
          alt="Figma logo"
          width={20}
          height={20}
          className="mr-2"
        />
      )}{" "}
      Sign in with Figma
    </Button>
  );
}