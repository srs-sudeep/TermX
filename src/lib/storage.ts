 

export const STORAGE_NAMESPACE = 'termfolio:';

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_NAMESPACE}${key}`);
    if (raw === null) return fallback;

    return JSON.parse(raw) as T;
  } catch {
    
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${STORAGE_NAMESPACE}${key}`, JSON.stringify(value));
  } catch {
    
  }
}

function remove(key: string): void {
  try {
    localStorage.removeItem(`${STORAGE_NAMESPACE}${key}`);
  } catch {
    
  }
}

export const storage = { get, set, remove } as const;
