import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { storage, STORAGE_NAMESPACE } from '@/lib/storage';

// ── helpers ────────────────────────────────────────────────────────────────────

/** Full namespaced key for a given short key. */
function nsKey(key: string): string {
  return `${STORAGE_NAMESPACE}${key}`;
}

// ── suite ──────────────────────────────────────────────────────────────────────

describe('storage', () => {
  // Clear localStorage between tests to prevent state leakage.
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── STORAGE_NAMESPACE ────────────────────────────────────────────────────────

  describe('STORAGE_NAMESPACE', () => {
    it('is the string "termfolio:"', () => {
      expect(STORAGE_NAMESPACE).toBe('termfolio:');
    });
  });

  // ── storage.get ────────────────────────────────────────────────────────────────

  describe('get', () => {
    it('returns the fallback when the key is absent', () => {
      expect(storage.get('theme', 'dracula')).toBe('dracula');
    });

    it('returns the stored value when the key exists', () => {
      localStorage.setItem(nsKey('theme'), JSON.stringify('nord'));
      expect(storage.get('theme', 'dracula')).toBe('nord');
    });

    it('deserialises a stored object', () => {
      const obj = { size: 'lg', family: 'Fira Code' };
      localStorage.setItem(nsKey('font'), JSON.stringify(obj));
      expect(storage.get('font', null)).toEqual(obj);
    });

    it('deserialises a stored boolean', () => {
      localStorage.setItem(nsKey('bootEnabled'), JSON.stringify(false));
      expect(storage.get('bootEnabled', true)).toBe(false);
    });

    it('deserialises a stored number', () => {
      localStorage.setItem(nsKey('count'), JSON.stringify(42));
      expect(storage.get('count', 0)).toBe(42);
    });

    it('namespaces the key — does NOT read an un-prefixed entry', () => {
      localStorage.setItem('theme', JSON.stringify('matrix')); // no namespace prefix
      expect(storage.get('theme', 'dracula')).toBe('dracula');
    });

    // ── error fallbacks ──────────────────────────────────────────────────────

    it('returns the fallback when localStorage.getItem throws (SecurityError)', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new DOMException('The operation is insecure.', 'SecurityError');
      });
      expect(storage.get('theme', 'dracula')).toBe('dracula');
    });

    it('returns the fallback when localStorage.getItem throws a generic Error', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(storage.get('anything', 'fallback')).toBe('fallback');
    });

    it('returns the fallback when the stored value is not valid JSON', () => {
      localStorage.setItem(nsKey('corrupted'), 'not-json{{{');
      expect(storage.get('corrupted', 'safe')).toBe('safe');
    });

    it('returns null fallback when stored value is valid JSON null', () => {
      localStorage.setItem(nsKey('nullable'), JSON.stringify(null));
      // JSON.parse('null') === null; null !== null is false so it should return null
      // not the fallback — the key exists and the value is null
      expect(storage.get<string | null>('nullable', 'fallback')).toBeNull();
    });
  });

  // ── storage.set ────────────────────────────────────────────────────────────────

  describe('set', () => {
    it('writes a string value under the namespaced key', () => {
      storage.set('theme', 'nord');
      expect(localStorage.getItem(nsKey('theme'))).toBe(JSON.stringify('nord'));
    });

    it('writes a boolean', () => {
      storage.set('bootEnabled', false);
      expect(localStorage.getItem(nsKey('bootEnabled'))).toBe('false');
    });

    it('writes an object', () => {
      const obj = { size: 'lg', family: 'Fira Code' };
      storage.set('font', obj);
      expect(JSON.parse(localStorage.getItem(nsKey('font'))!)).toEqual(obj);
    });

    it('overwrites an existing value', () => {
      storage.set('theme', 'dracula');
      storage.set('theme', 'nord');
      expect(localStorage.getItem(nsKey('theme'))).toBe(JSON.stringify('nord'));
    });

    it('does not throw when localStorage.setItem throws (quota exceeded)', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      });
      expect(() => storage.set('theme', 'nord')).not.toThrow();
    });

    it('does not throw when localStorage.setItem throws SecurityError', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('The operation is insecure.', 'SecurityError');
      });
      expect(() => storage.set('key', 'value')).not.toThrow();
    });
  });

  // ── storage.remove ─────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('deletes the namespaced key', () => {
      storage.set('theme', 'nord');
      storage.remove('theme');
      expect(localStorage.getItem(nsKey('theme'))).toBeNull();
    });

    it('does not throw when the key does not exist', () => {
      expect(() => storage.remove('nonexistent')).not.toThrow();
    });

    it('does not affect other keys', () => {
      storage.set('theme', 'nord');
      storage.set('fontSize', 'lg');
      storage.remove('theme');
      expect(storage.get('fontSize', 'md')).toBe('lg');
    });

    it('does not throw when localStorage.removeItem throws (SecurityError)', () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new DOMException('The operation is insecure.', 'SecurityError');
      });
      expect(() => storage.remove('key')).not.toThrow();
    });
  });

  // ── round-trip ──────────────────────────────────────────────────────────────────

  describe('round-trip set → get', () => {
    it('string survives a round-trip', () => {
      storage.set('theme', 'matrix');
      expect(storage.get('theme', 'dracula')).toBe('matrix');
    });

    it('boolean false survives a round-trip (falsy but not missing)', () => {
      storage.set('bootEnabled', false);
      expect(storage.get('bootEnabled', true)).toBe(false);
    });

    it('number survives a round-trip', () => {
      storage.set('counter', 7);
      expect(storage.get('counter', 0)).toBe(7);
    });

    it('array survives a round-trip', () => {
      const arr = ['cmd1', 'cmd2', 'cmd3'];
      storage.set('history', arr);
      expect(storage.get<string[]>('history', [])).toEqual(arr);
    });

    it('null survives a round-trip (not confused with absent key)', () => {
      storage.set('nullable', null);
      expect(storage.get('nullable', 'fallback')).toBeNull();
    });
  });
});
