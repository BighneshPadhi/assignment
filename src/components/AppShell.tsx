"use client";

import { PropsWithChildren, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import { signOut } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Users", href: "/users" },
  { label: "Products", href: "/products" },
];

export default function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: "/login" });
  }, []);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" color="default" elevation={0}>
        <Toolbar sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Console
          </Typography>
          <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
              <Button
                key={item.href}
                color={isActive ? "primary" : "inherit"}
                onClick={() => router.push(item.href)}
              >
                {item.label}
              </Button>
              );
            })}
          </Stack>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleSignOut}
          >
            {user?.name ? `Sign out ${user.name}` : "Sign out"}
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: { xs: "block", md: "none" }, px: 2, py: 1 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
            <Button
              key={item.href}
              size="small"
              variant={isActive ? "contained" : "text"}
              onClick={() => router.push(item.href)}
            >
              {item.label}
            </Button>
            );
          })}
        </Stack>
      </Box>
      <Container sx={{ py: { xs: 3, md: 5 } }}>{children}</Container>
    </Box>
  );
}
