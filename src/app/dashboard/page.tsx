"use client";

import { useMemo } from "react";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const greeting = useMemo(() => {
    if (!user?.name) {
      return "Welcome back";
    }
    return `Welcome back, ${user.name}`;
  }, [user?.name]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600 }} gutterBottom>
          {greeting}
        </Typography>
        <Typography color="text.secondary">
          Manage users and products with the latest DummyJSON data.
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        }}
      >
        {[
          {
            title: "Users",
            description: "Browse user profiles, search, and paginate results.",
            action: () => router.push("/users"),
          },
          {
            title: "Products",
            description: "Filter products by category and review details.",
            action: () => router.push("/products"),
          },
        ].map((card) => (
          <Box key={card.title}>
            <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e2e8f0" }}>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {card.title}
                  </Typography>
                  <Typography color="text.secondary">{card.description}</Typography>
                  <Button variant="contained" onClick={card.action} sx={{ alignSelf: "flex-start" }}>
                    Open {card.title}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
