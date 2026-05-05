"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
      router.push(callbackUrl);
    }
  }, [status, router, searchParams]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!response?.ok) {
      setError("Invalid credentials. Try kminchelle / 0lelplR.");
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
    router.push(callbackUrl);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 40%, #f1f5f9 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }} gutterBottom>
                Admin Login
              </Typography>
              <Typography color="text.secondary">
                Sign in to manage users and products.
              </Typography>
            </Box>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                <Button type="submit" variant="contained" size="large" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </Stack>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Demo account: kminchelle / 0lelplR
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
