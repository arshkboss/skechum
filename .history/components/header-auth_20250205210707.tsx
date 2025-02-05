import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
export default function AuthButton({ user }: { user: any }) {
  const fullName = user?.identities?.[0]?.identity_data?.full_name || user?.email;
  const avtar=user?.identities?.[0]?.identity_data?.avatar_url;

  return user ? (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <Image src={avtar} alt={fullName} width={32} height={32} />
      
      <p>Hey, {fullName}!</p></div>
      <form action={signOutAction}>
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}

