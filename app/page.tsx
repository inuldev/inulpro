"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Signed out succesfully");
        },
      },
    });
  }

  function handleLogin() {
    router.push("/login");
  }

  return (
    <div className="p-24">
      <h1 className="text-2xl font-bold text-red-500">InulPRO.</h1>

      <ThemeToggle />

      {session ? (
        <div>
          <p>{session.user.name}</p>
          <Button onClick={signOut}>Logout</Button>
        </div>
      ) : (
        <Button className="ml-2" onClick={handleLogin}>
          Login
        </Button>
      )}
    </div>
  );
}
