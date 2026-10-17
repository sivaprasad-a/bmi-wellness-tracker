import type { BmiResult } from './bmi';

const KEY = 'bmi-wellness:last-result';

/** Persists the latest BMI result so other routes (e.g. the salad builder) can personalise advice. */
export function saveLastResult(result: BmiResult): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...result, calculatedAt: result.calculatedAt.toISOString() }));
  } catch {
    // Storage can be unavailable (private mode, quota); personalisation is a nice-to-have.
  }
}

export function loadLastResult(): BmiResult | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.bmi !== 'number' || typeof parsed?.input?.weightKg !== 'number') return null;
    return { ...parsed, calculatedAt: new Date(parsed.calculatedAt) } as BmiResult;
  } catch {
    return null;
  }
}
