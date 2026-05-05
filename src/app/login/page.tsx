import { Suspense } from "react";
import LoginClient from "@/app/login/LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div /> }>
      <LoginClient />
    </Suspense>
  );
}
