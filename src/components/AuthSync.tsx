"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthSync() {
  const { data: session, status } = useSession();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const clear = useAuthStore((state) => state.clear);

  useEffect(() => {
    if (status === "authenticated") {
      setToken(session?.accessToken);
      setUser(session?.user);
    }

    if (status === "unauthenticated") {
      clear();
    }
  }, [status, session, setToken, setUser, clear]);

  return null;
}
