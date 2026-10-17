import { describe, expect, it } from 'vitest';
import {
  calculateBmi,
  calculateBmr,
  cmToFeetInches,
  dateStamp,
  evaluate,
  feetInchesToCm,
  formatDate,
  gaugeFraction,
  getCategory,
  healthyWeightRange,
  hydrationTarget,
  kgToLb,
  lbToKg,
  rangeBarFraction,
  stepGoal,
  walkingStats,
} from './bmi';

describe('calculateBmi', () => {
  it('computes BMI from height in cm and weight in kg', () => {
    expect(calculateBmi(170, 50)).toBeCloseTo(17.3, 1);
    expect(calculateBmi(180, 81)).toBeCloseTo(25, 1);
  });

  it('rejects non-positive input', () => {
    expect(() => calculateBmi(0, 50)).toThrow(RangeError);
    expect(() => calculateBmi(170, -1)).toThrow(RangeError);
    expect(() => calculateBmi(NaN, 50)).toThrow(RangeError);
  });
});

describe('getCategory', () => {
  it.each([
    [16, 'underweight'],
    [18.49, 'normal'], // rounds to 18.5
    [18.4, 'underweight'],
    [18.5, 'normal'],
    [24.9, 'normal'],
    [24.96, 'overweight'], // rounds to 25.0
    [25, 'overweight'],
    [29.9, 'overweight'],
    [30, 'obesity'],
    [42, 'obesity'],
  ])('BMI %s → %s', (bmi, expected) => {
    expect(getCategory(bmi)).toBe(expected);
  });
});

describe('derived metrics', () => {
  it('computes the healthy weight range for a height', () => {
    expect(healthyWeightRange(170)).toEqual({ min: 53.5, max: 72 });
  });

  it('computes BMR with Mifflin–St Jeor', () => {
    expect(calculateBmr({ heightCm: 170, weightKg: 50, age: 28, gender: 'male' })).toBe(1428);
    expect(calculateBmr({ heightCm: 165, weightKg: 60, age: 30, gender: 'female' })).toBe(1320);
  });

  it('returns null BMR when age or gender is missing', () => {
    expect(calculateBmr({ heightCm: 170, weightKg: 50 })).toBeNull();
    expect(calculateBmr({ heightCm: 170, weightKg: 50, age: 28 })).toBeNull();
    expect(calculateBmr({ heightCm: 170, weightKg: 50, gender: 'male' })).toBeNull();
  });

  it('computes a hydration target of 35 ml/kg', () => {
    expect(hydrationTarget(50)).toBe(1.75);
    expect(hydrationTarget(80)).toBe(2.8);
  });
});

describe('unit conversion', () => {
  it('converts feet/inches and centimeters both ways', () => {
    expect(feetInchesToCm(5, 7)).toBeCloseTo(170.18, 2);
    expect(cmToFeetInches(170)).toEqual({ feet: 5, inches: 7 });
    expect(cmToFeetInches(182.6)).toEqual({ feet: 6, inches: 0 });
  });

  it('converts pounds and kilograms both ways', () => {
    expect(lbToKg(110)).toBeCloseTo(49.9, 1);
    expect(kgToLb(50)).toBeCloseTo(110.23, 2);
  });
});

describe('evaluate', () => {
  it('matches the reference scenario from the design mock', () => {
    const now = new Date(2026, 9, 17);
    const r = evaluate({ heightCm: 170, weightKg: 50, age: 28, gender: 'male' }, now);
    expect(r.bmi).toBe(17.3);
    expect(r.category).toBe('underweight');
    expect(r.bmrKcal).toBe(1428);
    expect(r.hydrationLiters).toBe(1.75);
    expect(formatDate(r.calculatedAt)).toBe('Oct 17, 2026');
  });
});

describe('stepGoal', () => {
  it('scales the daily target with BMI', () => {
    expect(stepGoal(17)).toEqual({ target: 7000, start: 5000, weeklyIncrease: 500 });
    expect(stepGoal(18.5).target).toBe(8000);
    expect(stepGoal(24.9).target).toBe(10000);
    expect(stepGoal(25).target).toBe(10000);
    expect(stepGoal(29.9).target).toBe(12000);
    expect(stepGoal(30)).toEqual({ target: 10000, start: 6000, weeklyIncrease: 500 });
  });

  it('starts lower for higher BMIs, never below 3,000', () => {
    expect(stepGoal(34).start).toBe(5000);
    expect(stepGoal(38).start).toBe(4000);
    expect(stepGoal(60).start).toBe(3000);
  });

  it('needs no ramp-up in the healthy range', () => {
    const g = stepGoal(22);
    expect(g.start).toBe(g.target);
    expect(g.weeklyIncrease).toBe(0);
  });
});

describe('walkingStats', () => {
  it('estimates distance from height-based stride, time and calories', () => {
    expect(walkingStats(10000, 180, 80)).toEqual({ km: 7.5, minutes: 100, kcal: 400 });
  });
});

describe('dateStamp', () => {
  it('formats the local date as YYYY-MM-DD', () => {
    expect(dateStamp(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });
});

describe('visual positions', () => {
  it('clamps gauge fraction to 0..1', () => {
    expect(gaugeFraction(5)).toBe(0);
    expect(gaugeFraction(60)).toBe(1);
    expect(gaugeFraction(26)).toBeCloseTo(0.5, 5);
  });

  it('places range bar marker inside the correct quarter', () => {
    expect(rangeBarFraction(17.3)).toBeGreaterThan(0);
    expect(rangeBarFraction(17.3)).toBeLessThan(0.25);
    expect(rangeBarFraction(22)).toBeGreaterThanOrEqual(0.25);
    expect(rangeBarFraction(22)).toBeLessThan(0.5);
    expect(rangeBarFraction(27)).toBeGreaterThanOrEqual(0.5);
    expect(rangeBarFraction(35)).toBeGreaterThanOrEqual(0.75);
    expect(rangeBarFraction(80)).toBe(1);
  });
});
