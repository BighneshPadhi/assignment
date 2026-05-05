"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import LoadingState from "@/components/LoadingState";
import { useUsersStore, type User } from "@/store/useUsersStore";

const UserRow = memo(function UserRow({ user }: { user: User }) {
  return (
    <TableRow hover>
      <TableCell>
        <Link href={`/users/${user.id}`}>{`${user.firstName} ${user.lastName}`}</Link>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.gender}</TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>{user.company?.name}</TableCell>
    </TableRow>
  );
});

const UserCard = memo(function UserCard({ user }: { user: User }) {
  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e2e8f0" }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">
            <Link href={`/users/${user.id}`}>{`${user.firstName} ${user.lastName}`}</Link>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
          <Typography variant="body2">{user.phone}</Typography>
          <Divider />
          <Typography variant="body2" color="text.secondary">
            {user.gender} • {user.company?.name}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
});

export default function UsersPage() {
  const { list, total, loading, error, fetchUsers } = useUsersStore();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const limit = 10;

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const loadUsers = useCallback(() => {
    fetchUsers({ limit, skip: (page - 1) * limit, query });
  }, [fetchUsers, limit, page, query]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600 }} gutterBottom>
          Users
        </Typography>
        <Typography color="text.secondary">Search and browse user profiles.</Typography>
      </Box>
      <TextField
        label="Search users"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setPage(1);
        }}
        placeholder="Search by name or email"
      />
      {loading ? (
        <LoadingState />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Company</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box sx={{ display: { xs: "grid", md: "none" }, gap: 2 }}>
            {list.map((user) => (
              <Box key={user.id}>
                <UserCard user={user} />
              </Box>
            ))}
          </Box>
        </>
      )}
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => setPage(value)}
        color="primary"
        sx={{ alignSelf: "center" }}
      />
    </Stack>
  );
}
