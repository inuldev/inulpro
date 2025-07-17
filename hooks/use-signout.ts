"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export function useSignOut() {
  const router = useRouter();

  const handleSignout = async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Signed out succesfully");
        },
        onError: (error) => {
          toast.error("Failed to sign out " + error.error.message);
        },
      },
    });
  };

  return handleSignout;
}
