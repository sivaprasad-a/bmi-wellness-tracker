import { cmToFeetInches, feetInchesToCm, kgToLb, lbToKg, round, type BmiInput, type Gender, type UnitSystem } from './bmi';

export interface FormValues {
  name: string;
  units: UnitSystem;
  heightCm: string;
  heightFt: string;
  heightIn: string;
  weight: string;
  age: string;
  gender: Gender;
}

export type FormField = 'name' | 'height' | 'weight' | 'age';
export type FormErrors = Partial<Record<FormField, string>>;

export const NAME_MAX_LENGTH = 50;

export const DEFAULT_VALUES: FormValues = {
  name: '',
  units: 'metric',
  heightCm: '170',
  heightFt: '5',
  heightIn: '7',
  weight: '50',
  age: '28',
  gender: 'male',
};

const num = (s: string): number => (s.trim() === '' ? NaN : Number(s));

export type NumericKind = 'decimal' | 'integer';

/**
 * Whether a partially typed value is allowed in a numeric text field:
 * digits only, up to `maxDigits` before the point, and (for decimals) one decimal place.
 * Empty is allowed so the field can be cleared.
 */
export function isNumericInput(value: string, kind: NumericKind, maxDigits = 3): boolean {
  const pattern = kind === 'decimal' ? new RegExp(`^\\d{0,${maxDigits}}(\\.\\d?)?$`) : new RegExp(`^\\d{0,${maxDigits}}$`);
  return pattern.test(value);
}

export const normalizeName = (raw: string): string => raw.trim().replace(/\s+/g, ' ');

/** Returns an error message for an invalid (already normalized) name, or undefined if valid. */
export function validateName(name: string, required = false): string | undefined {
  if (!name) return required ? 'Please enter your name' : undefined;
  if (name.length > NAME_MAX_LENGTH) return `Name must be ${NAME_MAX_LENGTH} characters or fewer`;
  // Latin letters only: the PDF's built-in Helvetica font can't render other scripts.
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ .'-]*$/.test(name)) return 'Use letters, spaces, apostrophes or hyphens';
  return undefined;
}

export function parseForm(v: FormValues): { input: BmiInput | null; errors: FormErrors } {
  const errors: FormErrors = {};

  const name = normalizeName(v.name);
  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  let heightCm: number;
  if (v.units === 'metric') {
    heightCm = num(v.heightCm);
  } else {
    const ft = num(v.heightFt);
    const inch = v.heightIn.trim() === '' ? 0 : num(v.heightIn);
    heightCm = Number.isFinite(ft) && Number.isFinite(inch) && inch >= 0 && inch < 12 ? feetInchesToCm(ft, inch) : NaN;
  }
  if (!Number.isFinite(heightCm)) errors.height = 'Enter a valid height';
  else if (heightCm < 50 || heightCm > 272) {
    errors.height = v.units === 'metric' ? 'Height must be between 50 and 272 cm' : 'Height must be between 1 ft 8 in and 8 ft 11 in';
  }

  const rawWeight = num(v.weight);
  const weightKg = v.units === 'metric' ? rawWeight : lbToKg(rawWeight);
  if (!Number.isFinite(weightKg)) errors.weight = 'Enter a valid weight';
  else if (weightKg < 10 || weightKg > 500) {
    errors.weight = v.units === 'metric' ? 'Weight must be between 10 and 500 kg' : 'Weight must be between 22 and 1100 lb';
  }

  let age: number | undefined;
  if (v.age.trim() !== '') {
    age = num(v.age);
    if (!Number.isInteger(age) || age < 2 || age > 120) errors.age = 'Age must be a whole number between 2 and 120';
  }

  if (Object.keys(errors).length) return { input: null, errors };
  return { input: { name: name || undefined, heightCm, weightKg, age, gender: v.gender || undefined }, errors };
}

/** Converts entered values when switching between metric and imperial. */
export function switchUnits(v: FormValues, units: UnitSystem): FormValues {
  if (v.units === units) return v;
  const w = num(v.weight);
  if (units === 'imperial') {
    const cm = num(v.heightCm);
    const fi = Number.isFinite(cm) ? cmToFeetInches(cm) : null;
    return {
      ...v,
      units,
      heightFt: fi ? String(fi.feet) : '',
      heightIn: fi ? String(fi.inches) : '',
      weight: Number.isFinite(w) ? String(round(kgToLb(w), 1)) : '',
    };
  }
  const ft = num(v.heightFt);
  const inch = v.heightIn.trim() === '' ? 0 : num(v.heightIn);
  return {
    ...v,
    units,
    heightCm: Number.isFinite(ft) && Number.isFinite(inch) ? String(Math.round(feetInchesToCm(ft, inch))) : '',
    weight: Number.isFinite(w) ? String(round(lbToKg(w), 1)) : '',
  };
}
