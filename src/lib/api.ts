import { clearAuth, readAuth, saveAuth, type AuthPayload } from "./auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

export const API_URL = apiUrl;

type ApiInit = RequestInit & {
  auth?: boolean;
  retry?: boolean;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

let refreshPromise: Promise<AuthPayload | null> | null = null;

async function refreshAuthToken() {
  const current = readAuth();

  if (!current?.refreshToken) {
    clearAuth();
    return null;
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ refreshToken: current.refreshToken }),
    cache: "no-store"
  });

  if (!response.ok) {
    clearAuth();
    return null;
  }

  const nextAuth = (await response.json()) as AuthPayload;
  saveAuth(nextAuth);
  return nextAuth;
}

export async function apiFetch<T>(
  path: string,
  init?: ApiInit
): Promise<T> {
  const headers = new Headers(init?.headers);
  const useAuth = init?.auth ?? true;
  const allowRetry = init?.retry ?? true;

  if (useAuth) {
    const auth = readAuth();
    if (auth?.accessToken) {
      headers.set("Authorization", `Bearer ${auth.accessToken}`);
    }
  }

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store"
  });

  if (response.status === 401 && useAuth && allowRetry) {
    if (!refreshPromise) {
      refreshPromise = refreshAuthToken().finally(() => {
        refreshPromise = null;
      });
    }

    const refreshed = await refreshPromise;

    if (refreshed?.accessToken) {
      return apiFetch<T>(path, { ...init, retry: false });
    }

    throw new ApiError(401, "Phiên đăng nhập đã hết hạn");
  }

  // Check valid JSON response
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!response.ok) {
    const text = await response.text();
    let message = "Yêu cầu thất bại. Vui lòng thử lại.";
    if (isJson) {
      try {
        const errorData = JSON.parse(text);
        message = errorData.message || message;
      } catch (e) { }
    } else {
      message = text || message;
    }

    // Remove "Error: " prefix if it exists
    message = message.replace(/^Error:\s*/i, "");

    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (!isJson) {
    throw new ApiError(response.status, "API returned non-JSON response");
  }

  return (await response.json()) as T;
}
