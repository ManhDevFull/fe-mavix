/**
 * SSR Polyfill for Node.js 25+ environments
 * Fixes broken/missing localStorage during Next.js server-side execution
 */
const mockStorage = {
    getItem: () => null,
    setItem: () => { },
    removeItem: () => { },
    clear: () => { },
    key: () => null,
    length: 0,
};

if (typeof globalThis !== "undefined") {
    const g = globalThis as any;
    if (!g.localStorage || typeof g.localStorage.getItem !== "function") {
        try {
            Object.defineProperty(g, 'localStorage', {
                value: mockStorage,
                writable: true,
                configurable: true
            });
        } catch (e) {
            g.localStorage = mockStorage;
        }
    }
}
