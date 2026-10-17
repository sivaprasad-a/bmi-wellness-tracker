export type UnitSystem = 'metric' | 'imperial';
export type Gender = 'male' | 'female' | 'other' | '';
export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obesity';

export interface BmiInput {
  name?: string;
  heightCm: number;
  weightKg: number;
  age?: number;
  gender?: Gender;
}

export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  healthyWeightKg: { min: number; max: number };
  bmrKcal: number | null;
  hydrationLiters: number;
  input: BmiInput;
  calculatedAt: Date;
}

export interface CategoryInfo {
  key: BmiCategory;
  label: string;
  rangeLabel: string;
  min: number;
  max: number;
  color: string;
  softColor: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { key: 'underweight', label: 'Underweight', rangeLabel: '< 18.5', min: 0, max: 18.5, color: '#3B82F6', softColor: '#DBEAFE' },
  { key: 'normal', label: 'Normal', rangeLabel: '18.5 – 24.9', min: 18.5, max: 25, color: '#22C55E', softColor: '#DCFCE7' },
  { key: 'overweight', label: 'Overweight', rangeLabel: '25 – 29.9', min: 25, max: 30, color: '#EAB308', softColor: '#FEF9C3' },
  { key: 'obesity', label: 'Obesity', rangeLabel: '≥ 30', min: 30, max: Infinity, color: '#EF4444', softColor: '#FEE2E2' },
];

export const HEALTHY_BMI = { min: 18.5, max: 24.9 };

const CM_PER_INCH = 2.54;
const KG_PER_LB = 0.45359237;

export const round = (value: number, decimals = 1): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

export const feetInchesToCm = (feet: number, inches: number): number =>
  (feet * 12 + inches) * CM_PER_INCH;

export const cmToFeetInches = (cm: number): { feet: number; inches: number } => {
  const totalInches = cm / CM_PER_INCH;
  let feet = Math.floor(totalInches / 12);
  let inches = Math.round(totalInches - feet * 12);
  if (inches === 12) {
    feet += 1;
    inches = 0;
  }
  return { feet, inches };
};

export const lbToKg = (lb: number): number => lb * KG_PER_LB;
export const kgToLb = (kg: number): number => kg / KG_PER_LB;

export function calculateBmi(heightCm: number, weightKg: number): number {
  if (!(heightCm > 0) || !(weightKg > 0)) {
    throw new RangeError('Height and weight must be positive numbers');
  }
  const meters = heightCm / 100;
  return weightKg / (meters * meters);
}

export function getCategory(bmi: number): BmiCategory {
  const rounded = round(bmi, 1);
  if (rounded < 18.5) return 'underweight';
  if (rounded < 25) return 'normal';
  if (rounded < 30) return 'overweight';
  return 'obesity';
}

export const getCategoryInfo = (category: BmiCategory): CategoryInfo =>
  CATEGORIES.find((c) => c.key === category)!;

export function healthyWeightRange(heightCm: number): { min: number; max: number } {
  const m = heightCm / 100;
  return { min: round(HEALTHY_BMI.min * m * m, 1), max: round(HEALTHY_BMI.max * m * m, 1) };
}

/** Basal metabolic rate using the Mifflin–St Jeor equation. */
export function calculateBmr(input: BmiInput): number | null {
  const { heightCm, weightKg, age, gender } = input;
  if (!age || age <= 0 || !gender) return null;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const offset = gender === 'male' ? 5 : gender === 'female' ? -161 : -78;
  return Math.round(base + offset);
}

/** Daily water recommendation: ~35 ml per kg of body weight. */
export const hydrationTarget = (weightKg: number): number => round((weightKg * 35) / 1000, 2);

export function evaluate(input: BmiInput, now: Date = new Date()): BmiResult {
  const bmi = round(calculateBmi(input.heightCm, input.weightKg), 1);
  return {
    bmi,
    category: getCategory(bmi),
    healthyWeightKg: healthyWeightRange(input.heightCm),
    bmrKcal: calculateBmr(input),
    hydrationLiters: hydrationTarget(input.weightKg),
    input,
    calculatedAt: now,
  };
}

/** Scale range used by the gauge visual. */
export const GAUGE_MIN = 12;
export const GAUGE_MAX = 40;

/** Fraction (0–1) along the gauge for a BMI value. */
export const gaugeFraction = (bmi: number): number =>
  Math.min(1, Math.max(0, (bmi - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)));

/**
 * Fraction (0–1) along a 4-segment range bar where each category occupies
 * an equal quarter of the width.
 */
export function rangeBarFraction(bmi: number): number {
  const bounds: [number, number][] = [
    [14, 18.5],
    [18.5, 25],
    [25, 30],
    [30, 40],
  ];
  const idx = CATEGORIES.findIndex((c) => c.key === getCategory(bmi));
  const [lo, hi] = bounds[idx];
  const within = Math.min(1, Math.max(0, (bmi - lo) / (hi - lo)));
  return (idx + within) / 4;
}

export const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/** YYYY-MM-DD in the user's local timezone (toISOString would use UTC). */
export const dateStamp = (date: Date): string =>
  [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((n) => String(n).padStart(2, '0')).join('-');

export interface StepGoal {
  /** Daily step target to work towards. */
  target: number;
  /** Suggested starting point; equals target when no ramp-up is needed. */
  start: number;
  /** Steps to add each week until the target is reached. */
  weeklyIncrease: number;
}

const roundTo500 = (n: number) => Math.round(n / 500) * 500;

/**
 * Daily walking goal scaled by BMI value:
 * - underweight: moderate goal that keeps you active without burning too many calories
 * - normal: 8k–10k, rising slightly towards the top of the healthy range
 * - overweight: 10k–12k, rising with BMI to support weight loss
 * - obesity: 10k target, with a lower starting point the higher the BMI to protect joints
 */
export function stepGoal(bmi: number): StepGoal {
  switch (getCategory(bmi)) {
    case 'underweight':
      return { target: 7000, start: 5000, weeklyIncrease: 500 };
    case 'normal': {
      const target = roundTo500(8000 + ((Math.min(bmi, 24.9) - 18.5) / 6.4) * 2000);
      return { target, start: target, weeklyIncrease: 0 };
    }
    case 'overweight':
      return { target: roundTo500(10000 + (Math.min(bmi, 29.9) - 25) * 400), start: 7000, weeklyIncrease: 1000 };
    case 'obesity':
      return { target: 10000, start: Math.max(3000, roundTo500(6000 - (bmi - 30) * 250)), weeklyIncrease: 500 };
  }
}

/** Approximate walking distance (km) and duration (minutes) for a step count. */
export function walkingStats(steps: number, heightCm: number, weightKg: number) {
  const strideM = (heightCm * 0.415) / 100;
  return {
    km: round((steps * strideM) / 1000, 1),
    minutes: Math.round(steps / 100),
    kcal: Math.round(steps * 0.0005 * weightKg),
  };
}
