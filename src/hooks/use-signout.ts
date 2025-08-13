"use client"

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignOut = () => {
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logout Successfully");
          router.push("/login");
        },
        onError: (err) => {
          toast.error(err.error.message || "Failed To Logout");
        },
      },
    });
  };

  return handleLogout;
};
