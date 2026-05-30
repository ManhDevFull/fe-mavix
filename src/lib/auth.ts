/** 
 * ANTI-CRASH POLYFILL
 * Fixes environments where a broken 'localStorage' object is injected into the global scope
 * (e.g. some AI terminal environments or buggy node polyfills).
 */
if (typeof global !== 'undefined' && (global as any).localStorage) {
  try {
    if (typeof (global as any).localStorage.getItem !== 'function') {
      throw new Error("Broken localStorage detected");
    }
  } catch (e) {
    (global as any).localStorage = {
      getItem: () => null,
      setItem: () => { },
      removeItem: () => { },
      clear: () => { },
      key: () => null,
      length: 0
    };
  }
}

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

const STORAGE_KEY = "postcardqr-auth";

function getStorage() {
  if (typeof window !== "undefined") {
    try {
      const storage = window.localStorage;
      if (
        storage &&
        typeof storage.getItem === "function" &&
        typeof storage.setItem === "function" &&
        typeof storage.removeItem === "function"
      ) {
        return storage;
      }
    } catch {
      // SecurityError or other issues
    }
  }

  return null;
}

export function saveAuth(payload: AuthPayload) {
  const storage = getStorage();
  storage?.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function readAuth() {
  const storage = getStorage();
  const raw = storage?.getItem(STORAGE_KEY);

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
  const storage = getStorage();
  storage?.removeItem(STORAGE_KEY);
}

export function hasStoredAuth() {
  return readAuth() !== null;
}
