/** 
 * ANTI-CRASH POLYFILL
 * Fixes environments where a broken 'localStorage' object is injected into the global scope
 * (e.g. some AI terminal environments or buggy node polyfills).
 */
const isBrowser = typeof window !== "undefined";

function getSafeStorage() {
  // 1. Check Browser window
  if (typeof window !== "undefined") {
    try {
      const s = window.localStorage;
      if (s && typeof s.getItem === "function") return s;
    } catch (e) { }
  }

  // 2. Check Node global (especially for Node 25+ which has a broken/internal global localStorage)
  if (typeof global !== "undefined") {
    try {
      const s = (global as any).localStorage;
      if (s && typeof s.getItem === "function") return s;
    } catch (e) { }
  }

  // 3. Fallback placeholder
  return {
    getItem: () => null,
    setItem: () => { },
    removeItem: () => { },
    clear: () => { },
    key: () => null,
    length: 0
  };
}

export const safeStorage = getSafeStorage();

export type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
  restaurant: {
    id: number;
    name: string;
    slug: string;
  };
};

const STORAGE_KEY = "mavix-auth";

export function saveAuth(payload: AuthPayload) {
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function readAuth() {
  const raw = safeStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthPayload;
  } catch {
    return null;
  }
}

export function clearAuth() {
  safeStorage.removeItem(STORAGE_KEY);
}

export function hasStoredAuth() {
  return readAuth() !== null;
}
