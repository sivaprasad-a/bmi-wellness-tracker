import { beforeEach, describe, expect, it } from 'vitest';
import { evaluate } from './bmi';
import { loadLastResult, saveLastResult } from './storage';

describe('last result storage', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips a result, reviving the date', () => {
    const result = evaluate({ name: 'Asha', heightCm: 160, weightKg: 70, age: 35, gender: 'female' }, new Date(2026, 9, 17, 9));
    saveLastResult(result);
    const loaded = loadLastResult()!;
    expect(loaded.bmi).toBe(27.3);
    expect(loaded.input.name).toBe('Asha');
    expect(loaded.calculatedAt).toBeInstanceOf(Date);
    expect(loaded.calculatedAt.getTime()).toBe(result.calculatedAt.getTime());
  });

  it('returns null when nothing or something invalid is stored', () => {
    expect(loadLastResult()).toBeNull();
    localStorage.setItem('bmi-wellness:last-result', '{not json');
    expect(loadLastResult()).toBeNull();
    localStorage.setItem('bmi-wellness:last-result', JSON.stringify({ hello: 'world' }));
    expect(loadLastResult()).toBeNull();
  });
});
