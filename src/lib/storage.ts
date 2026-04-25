/**
 * storage.ts
 * Namespaced localStorage adapter for termfolio.
 *
 * All keys are prefixed with "termfolio:" to avoid collisions with
 * other scripts on the same origin.
 *
 * Error handling:
 *  - SecurityError  — localStorage blocked (private browsing, cross-origin iframe)
 *  - QuotaExceededError — storage full
 *  - SyntaxError    — corrupted / non-JSON value stored by an older version
 *
 * In all error cases `get` returns the caller-supplied fallback;
 * `set` and `remove` fail silently. The app degrades gracefully
 * (preferences don't persist, but nothing crashes).
 *
 * No React imports — this module must stay framework-agnostic.
 */

/** The prefix prepended to every key written to localStorage. */
export const STORAGE_NAMESPACE = 'termfolio:';

/**
 * Retrieves and deserialises a value from localStorage.
 *
 * @param key      - Unprefixed key (e.g. `'theme'` → reads `termfolio:theme`).
 * @param fallback - Returned when the key is absent or any error occurs.
 * @returns The stored value, or `fallback` on any failure.
 *
 * @example
 * const theme = storage.get('theme', 'dracula');
 * const fontSize = storage.get<'sm' | 'md' | 'lg'>('fontSize', 'md');
 */
function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_NAMESPACE}${key}`);
    if (raw === null) return fallback;
    // JSON.parse is typed as `any`; the cast to T is intentional — callers
    // supply the generic so they bear responsibility for the shape.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(raw) as T;
  } catch {
    // SecurityError, QuotaExceededError, SyntaxError — all fall through.
    return fallback;
  }
}

/**
 * Serialises and stores a value in localStorage.
 * Fails silently on quota or privacy errors.
 *
 * @param key   - Unprefixed key.
 * @param value - Any JSON-serialisable value.
 *
 * @example
 * storage.set('theme', 'nord');
 * storage.set('fontSize', 'lg');
 */
function set<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${STORAGE_NAMESPACE}${key}`, JSON.stringify(value));
  } catch {
    // QuotaExceededError or SecurityError — preference simply won't persist.
  }
}

/**
 * Removes a key from localStorage.
 * Fails silently if the key is absent or access is blocked.
 *
 * @param key - Unprefixed key.
 *
 * @example
 * storage.remove('font'); // clear custom font override
 */
function remove(key: string): void {
  try {
    localStorage.removeItem(`${STORAGE_NAMESPACE}${key}`);
  } catch {
    // SecurityError — nothing to do.
  }
}

/** Namespaced localStorage adapter. Import and use as `storage.get(...)`. */
export const storage = { get, set, remove } as const;
