"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import LoadingState from "@/components/LoadingState";
import { useUsersStore, type User } from "@/store/useUsersStore";

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const { fetchUser, error } = useUsersStore();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      setLoading(false);
      return;
    }

    fetchUser(id)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [params.id, fetchUser]);

  if (loading) {
    return <LoadingState />;
  }

  if (!user) {
    return <Typography color="error">{error ?? "User not found"}</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Button component={Link} href="/users" sx={{ alignSelf: "flex-start" }}>
        Back to Users
      </Button>
      <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e2e8f0" }}>
        <CardContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }} gutterBottom>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography color="text.secondary">@{user.username}</Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography>{user.email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
                <Typography>{user.phone}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Gender
                </Typography>
                <Typography>{user.gender}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Company
                </Typography>
                <Typography>{user.company?.name ?? "-"}</Typography>
              </Box>
              <Box sx={{ gridColumn: { xs: "auto", md: "1 / -1" } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Typography>
                  {user.address
                    ? `${user.address.address}, ${user.address.city}, ${user.address.state}`
                    : "-"}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
