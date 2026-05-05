import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/app/providers";
import AppShell from "@/components/AppShell";
import { sora } from "@/theme/theme";

export const metadata: Metadata = {
  title: "Admin Console",
  description: "Assignment admin console",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sora.variable}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
