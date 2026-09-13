/**
 * utils/id.ts
 * Monotonic, collision-resistant IDs for UI elements (popups, trail bits,
 * symbols). Uses crypto.randomUUID() when available for guaranteed uniqueness
 * across HMR / StrictMode double-invocation; falls back to a monotonic counter.
 *
 * We deliberately avoid module-level `let id = 0; id++` because that pattern
 * double-reserves IDs under React 19 StrictMode and after HMR, causing
 * spurious React key warnings.
 */

export function uid(prefix = 'id'): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  // Cheap fallback (test envs / very old browsers): monotonic + random salt
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
