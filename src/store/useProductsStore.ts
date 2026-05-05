import { create } from "zustand";
import { fetchJson } from "@/lib/api";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  thumbnail: string;
  images: string[];
  brand?: string;
  sku?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  stock?: number;
};

type ProductsResponse = {
  products: Product[];
  total: number;
  limit: number;
  skip: number;
};

type ProductsState = {
  list: Product[];
  total: number;
  categories: string[];
  loading: boolean;
  error?: string;
  cache: Record<string, ProductsResponse>;
  productCache: Record<number, Product>;
  fetchProducts: (params: {
    limit: number;
    skip: number;
    query: string;
    category: string;
  }) => Promise<void>;
  fetchProduct: (id: number) => Promise<Product | undefined>;
  fetchCategories: () => Promise<void>;
};

export const useProductsStore = create<ProductsState>((set, get) => ({
  list: [],
  total: 0,
  categories: [],
  loading: false,
  error: undefined,
  cache: {},
  productCache: {},
  fetchProducts: async ({ limit, skip, query, category }) => {
    const key = `products:${limit}:${skip}:${query}:${category}`;
    const cached = get().cache[key];

    // Cache list results to reduce repeated API calls and keep pagination/snappy filters fast.
    if (cached) {
      set({ list: cached.products, total: cached.total, error: undefined });
      return;
    }

    set({ loading: true, error: undefined });

    try {
      let response: ProductsResponse;
      if (category) {
        response = await fetchJson<ProductsResponse>(
          `/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
        );
      } else if (query.trim()) {
        response = await fetchJson<ProductsResponse>(
          `/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
        );
      } else {
        response = await fetchJson<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
      }

      set((state) => ({
        list: response.products,
        total: response.total,
        cache: { ...state.cache, [key]: response },
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load products",
        loading: false,
      });
    }
  },
  fetchProduct: async (id) => {
    const cached = get().productCache[id];
    if (cached) {
      return cached;
    }

    try {
      const product = await fetchJson<Product>(`/products/${id}`);
      set((state) => ({
        productCache: { ...state.productCache, [id]: product },
      }));
      return product;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load product" });
      return undefined;
    }
  },
  fetchCategories: async () => {
    if (get().categories.length) {
      return;
    }

    try {
      const categories = await fetchJson<string[]>("/products/categories");
      set({ categories });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load categories" });
    }
  },
}));

export type { Product };
