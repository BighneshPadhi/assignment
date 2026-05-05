"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import LoadingState from "@/components/LoadingState";
import { useProductsStore, type Product } from "@/store/useProductsStore";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { fetchProduct, error } = useProductsStore();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      setLoading(false);
      return;
    }

    fetchProduct(id)
      .then((result) => {
        setProduct(result);
        setActiveImage(result?.images?.[0] ?? result?.thumbnail);
      })
      .finally(() => setLoading(false));
  }, [params.id, fetchProduct]);

  const specs = useMemo(() => {
    if (!product) {
      return [];
    }
    return [
      { label: "Brand", value: product.brand ?? "-" },
      { label: "Stock", value: product.stock?.toString() ?? "-" },
      { label: "SKU", value: product.sku ?? "-" },
      { label: "Warranty", value: product.warrantyInformation ?? "-" },
      { label: "Shipping", value: product.shippingInformation ?? "-" },
      { label: "Availability", value: product.availabilityStatus ?? "-" },
    ];
  }, [product]);

  if (loading) {
    return <LoadingState />;
  }

  if (!product) {
    return <Typography color="error">{error ?? "Product not found"}</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Button component={Link} href="/products" sx={{ alignSelf: "flex-start" }}>
        Back to Products
      </Button>
      <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e2e8f0" }}>
        <CardContent>
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            }}
          >
            <Box>
              <Stack spacing={2}>
                <CardMedia
                  component="img"
                  height="320"
                  image={activeImage ?? product.thumbnail}
                  alt={product.title}
                  sx={{ borderRadius: 2, objectFit: "cover" }}
                />
                <Box
                  sx={{
                    display: "grid",
                    gap: 1,
                    gridTemplateColumns: "repeat(4, 1fr)",
                  }}
                >
                  {product.images.map((image) => (
                    <Box key={image}>
                      <Box
                        component="button"
                        onClick={() => setActiveImage(image)}
                        sx={{
                          p: 0,
                          border: 0,
                          background: "transparent",
                          cursor: "pointer",
                          width: "100%",
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="72"
                          image={image}
                          alt={product.title}
                          sx={{
                            borderRadius: 1,
                            border: image === activeImage ? "2px solid #1d4ed8" : "1px solid #e2e8f0",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Box>
            <Box>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }} gutterBottom>
                    {product.title}
                  </Typography>
                  <Typography color="text.secondary">{product.category}</Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  ${product.price.toFixed(2)}
                </Typography>
                <Typography>{product.description}</Typography>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }} gutterBottom>
                    Specifications
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 1,
                      gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                    }}
                  >
                    {specs.map((item) => (
                      <Box key={item.label}>
                        <Typography variant="caption" color="text.secondary">
                          {item.label}
                        </Typography>
                        <Typography>{item.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
