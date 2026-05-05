export const API_BASE_URL = "https://dummyjson.com";

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: Record<string, unknown>;
};

export async function fetchJson<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return response.json() as Promise<T>;
}
