"use client";

import { PropsWithChildren } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import AuthSync from "@/components/AuthSync";
import { theme } from "@/theme/theme";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <AppRouterCacheProvider>
      <SessionProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthSync />
          {children}
        </ThemeProvider>
      </SessionProvider>
    </AppRouterCacheProvider>
  );
}
