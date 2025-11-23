// src/api/client.ts
const API_URL = "http://localhost:8000"; // forzamos explícitamente por ahora

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    // Esto nos ayuda a ver en consola qué está pasando
    console.error("API error:", res.status, res.statusText, text);
    throw new Error(text || res.statusText);
  }

  return res.json() as Promise<T>;
}

export default apiFetch;
