"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LoadingState from "@/components/LoadingState";
import { useProductsStore, type Product } from "@/store/useProductsStore";

const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e2e8f0", height: "100%" }}>
      <CardMedia component="img" height="160" image={product.thumbnail} alt={product.title} />
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            <Link href={`/products/${product.id}`}>{product.title}</Link>
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {product.category}
          </Typography>
          <Typography variant="body2">${product.price.toFixed(2)}</Typography>
          <Typography variant="body2" color="text.secondary">
            Rating: {product.rating}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
});

export default function ProductsPage() {
  const { list, total, categories, loading, error, fetchProducts, fetchCategories } =
    useProductsStore();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const limit = 10;

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const loadProducts = useCallback(() => {
    fetchProducts({ limit, skip: (page - 1) * limit, query, category });
  }, [fetchProducts, limit, page, query, category]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600 }} gutterBottom>
          Products
        </Typography>
        <Typography color="text.secondary">Search, filter, and review products.</Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        }}
      >
        <Box>
          <TextField
            fullWidth
            label="Search products"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
        </Box>
        <Box>
          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              label="Category"
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">All categories</MenuItem>
              {categories.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          }}
        >
          {list.map((product) => (
            <Box key={product.id}>
              <ProductCard product={product} />
            </Box>
          ))}
        </Box>
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
